const uuid = require('uuid')
const path = require('path');
const {Comment, User, sequelize} = require('../models')

class CommentController {
    async create(req, res) {
        try {
            let {text, homePage, userId, commentId} = req.body

            if (!isUrlValid(homePage)) {
                res.status(400).send({
                    message: "Url is not valid or is empty!"
                });
                return;
            }
    
            if (isHTML(text)) {
                let parser = new DOMParser();
                let doc = parser.parseFromString(text, "application/xml");
                let errorNode = doc.querySelector('parsererror');
                if (errorNode) {
                    res.status(400).send({
                        message: "Text is invalid"
                    });
                    return;
                }
            }
    
            if(!userExist(userId)) {
                res.status(400).send({
                    message: "User not found"
                });
                return;
            }
    
            let fileUrl = '';
            if (typeof(req.file) !== "undefined") {
                const {file} = req.files
                fileUrl = uuid.v4() + path.extname(file);
                file.mv(path.resolve(__dirname, '..', 'uploads', fileUrl))
            }
            const comment = await Comment.create({
                text, 
                homePage, 
                userId, 
                commentId,
                fileUrl
            });
    
            return res.json(comment)
        } catch (e) {
            console.log(e);
            return res.status(400).send({
                message: "Something went wrong..."
            });
        }

    }

    async getAll(req, res) {
        let {limit, page} = req.query
        page = page || 1
        limit = limit || 25
        let offset = page * limit - limit
        let comments;

        comments = await Comment.findAndCountAll({
            where:{ commentId: null }, 
            limit, 
            offset
        })

        return res.json(comments)
    }

    async getReplays(req, res) {
        const {id} = req.params;

        const comment = await Comment.findOne(
            {
                where: {id},
                raw : true,
            })

        const getCommentsWithReplays = async (comment) => {
            let subComments = await Comment.findAll({
                where: {
                    commentId: comment.id
                },
                raw : true
            });
          
            if (subComments.length > 0) {
                const promises = [];
                subComments.forEach(comment => {
                    promises.push(getCommentsWithReplays(comment));
                });
                comment['subComments'] = await Promise.all(promises);
            }
            else comment['subComments'] = []; 
            return comment;
          };

        const comments = await getCommentsWithReplays(comment);

        return res.json(comments)
    }
}

var urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
var htmlRegex = /<\/?[a-z][\s\S]*>/;

function isUrlValid(url) {
  if (!url)
    return true;

  if(url.length>254)
    return false;

  var valid = urlRegex.test(url);
  if(!valid)
    return false;

  return true;
}

function isHTML(str) {
    if(!htmlRegex.test(str)) {
        return false;
    }

    return true;
}

function userExist (id) {
    return User.count({ where: { id: id } })
      .then(count => {
        if (count != 0) {
          return true;
        }
        return false;
    });
}

module.exports = new CommentController()