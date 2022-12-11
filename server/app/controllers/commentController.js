const uuid = require('uuid')
const path = require('path');
const sharp = require('sharp')
const fs = require('fs');
const jwt = require('jsonwebtoken')
const {Comment, User, sequelize} = require('../models')

class CommentController {
    async create(req, res) {
        try {
            let generatedToken = '';
            let userId;
            let {text, homePage, commentId} = req.body

            if (!commentId) {
                commentId = null
            }

            if (!req.headers.authorization || !req.headers.authorization.split(' ')[1]) {
                if (!req.body.ip) {
                    res.status(400).send({
                      message: "IP can not be empty!"
                    });
                    return;
                  }
              
                  if (!isEmailValid(req.body.email)) {
                      res.status(400).send({
                          message: "Email is not valid or is empty!"
                      });
                      return;
                  }
              
                  if (!isUsernameValid(req.body.username)) {
                      res.status(400).send({
                          message: "Username is not valid or is empty!"
                      });
                      return;
                  }

                  let count = await sequelize.query('SELECT count(*) as count FROM `comments`.`Users` as user WHERE user.username=? OR user.email=?;', {
                    replacements: [req.body.username, req.body.email]
                  });

                  if (count[0][0]['count'] > 0) {
                    res.status(400).send({
                        message: "User with this username or email exists!"
                    });
                    return;
                  }


                  let userByIP = await sequelize.query('SELECT user.id, user.username, user.email FROM `comments`.`Users` as user WHERE user.IP=? LIMIT 1;', {
                    replacements: [req.body.ip]
                  });

                  if(!userByIP[0][0]) {
                    const user = {
                        ip: req.body.ip,
                        username: req.body.username,
                        email: req.body.email
                      };
                      
    
                    User.create(user)
                    .then(data => {
                        userId = data.id
                        generatedToken = generateJwt(data.id, data.email, data.ip)
                    })
                    .catch(err => {
                        res.status(500).send({
                        message:
                            err.message || "Some error occurred while creating the User."
                        });
                    });
                  } else {
                    userId = userByIP[0][0].id
                    generatedToken = generateJwt(userByIP[0][0].id, userByIP[0][0].email, userByIP[0][0].username)
                  }

                await new Promise(resolve => setTimeout(resolve, 3000));
                    
            } else {
                const token = req.headers.authorization.split(' ')[1]
                const decoded = jwt.verify(token, process.env.SECRET_KEY)
                userId = decoded.id;
            }


            if (!isUrlValid(homePage)) {
                res.status(400).send({
                    message: "Url is not valid or is empty!"
                });
                return;
            }
    
            if (isHTML(text) && !isHTMLValid(text)) {
                res.status(400).send({
                    message: "Text is invalid"
                });
                return;
            }
    
            if(!userExist(userId)) {
                res.status(400).send({
                    message: "User not found"
                });
                return;
            }

            let fileName = '';
            console.log(req.files)
            if (req.files) {
                fileName = uuid.v4() + path.extname(req.files.file.name);
                let fileUrl = path.resolve(__dirname, '..', '..', 'uploads', fileName);

                sharp(req.files.file.data)
                .resize({ width: 240, height: 320 })
                .toBuffer()
                .then(data => {
                    fs.writeFile(
                        fileUrl,
                        data,
                        function (err) {
                            if (err) {
                                console.log(err);
                            }
                        }
                    );
                })
                
                await new Promise(resolve => setTimeout(resolve, 2000));
            }

            const comment = await Comment.create({
                text, 
                homePage, 
                userId, 
                commentId,
                fileUrl: fileName
            });
    
            return res.json({
                token : generatedToken,
                comment
            })
        } catch (e) {
            console.log(e);
            return res.status(400).send({
                message: "Something went wrong..."
            });
        }

    }

    async getAll(req, res) {
        let {sortBy, orderBy, limit, page} = req.query
        page = page || 1
        limit = limit || 25
        let offset = page * limit - limit
        let comments;

        switch(+sortBy) {
            case 0: {
                sortBy = "comment.createdAt";
                break;
            }
            case 1: {
                sortBy = "user.userName";
                break;
            }
            case 2: {
                sortBy = "user.email";
                break;
            }
            default: sortBy = "comment.createdAt";
        }

        switch(+orderBy) {
            case 0: {
                orderBy = "ASC";
                break;
            }
            case 1: {
                orderBy = "DESC";
                break;
            }
            default: orderBy = "ASC";
        }
        let count = await sequelize.query('SELECT count(*) AS `count` FROM `Comments` AS `Comment` WHERE `Comment`.`commentId` IS NULL');
        comments = await sequelize.query(`SELECT comment.id, comment.createdAt, comment.fileUrl, comment.text, user.username, user.email, (select count(*) from comments.Comments where commentId= comment.id ) as repliesCount FROM comments.Comments as comment INNER JOIN comments.Users as user ON comment.userId = user.id WHERE comment.commentId IS NULL ORDER BY ${sortBy} ${orderBy} LIMIT ${offset}, ${limit}`);

        return res.json({
            count: count[0][0]['count'],
            rows: comments[0]
        });
    }

    async getReplies(req, res) {
        const {id} = req.params;

        if (!id) {
            return res.status(400).send({
                message: "Id can not be empty!"
            });
        }

        const comment = await Comment.findOne(
            {
                where: {id},
                raw : true,
            })
        
        if (comment) {
            const comments = await sequelize.query('SELECT comment.commentId, comment.id, comment.createdAt, comment.fileUrl, comment.text, user.username, user.email, (select count(*) from `comments`.`Comments` where commentId= comment.id ) as repliesCount FROM `comments`.`Comments` as comment INNER JOIN `comments`.`Users` as user ON comment.userId = user.id WHERE comment.commentId = ?', {
                replacements: [id]
            });;

            return res.json(comments[0]);
        }

        return res.status(400).send({
            message: "Comment with such id was not found"
        });
    }
}

const generateJwt = (id, email, ip) => {
    return jwt.sign(
        {id, email, ip},
        process.env.SECRET_KEY
    )
}

var urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
var htmlRegex = /<\/?[a-z][\s\S]*>/;
var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
var usernameRegex = /^[a-zA-Z0-9_.-]*$/;

function isUsernameValid(username) {
  if (!username)
    return false;

  if(username.length>254)
    return false;

  var valid = usernameRegex.test(username);
  if(!valid)
    return false;

  return true;
}

function isEmailValid(email) {
  if (!email)
      return false;

  if(email.length>254)
      return false;

  var valid = emailRegex.test(email);
  if(!valid)
      return false;

  var parts = email.split("@");
  if(parts[0].length>64)
      return false;

  var domainParts = parts[1].split(".");
  if(domainParts.some(function(part) { return part.length>63; }))
      return false;

  return true;
}

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

function isHTMLValid(str) {
    if(str.indexOf("<code>")!=-1 && str.indexOf("</code>")!=-1) {
        str = str.replace('<code>', '');
        str = str.replace('</code>', '');
    }

    if(str.indexOf("<i>")!=-1 && str.indexOf("</i>")!=-1) {
        str = str.replace('<i>', '');
        str = str.replace('</i>', '');
    }

    if(str.indexOf("<strong>")!=-1 && str.indexOf("</strong>")!=-1) {
        str = str.replace('<strong>', '');
        str = str.replace('</strong>', '');
    }

    if((str.indexOf("<a")!=-1 && str.indexOf("</a>")!=-1) || (str.indexOf("<a")!=-1 && str.indexOf("/>")!=-1)) {
        str = str.replace('<a', '');
        str = str.replace('</a>', '');
        str = str.replace('>', '');
    }

    if(isHTML(str)) {
        return false
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