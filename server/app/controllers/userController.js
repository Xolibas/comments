const {User} = require('../models')

class UserController {
    async create(req, res, next) {
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
  
      const user = {
        ip: req.body.ip,
        username: req.body.username,
        email: req.body.email
      };
  
      User.create(user)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User."
          });
        });
    }

    async findOneByIp(req, res) {
      const {ip} = req.params
      const user = await User.findOne(
          {
              where: {ip},
          },
      )
      return res.json(user)
    };
}


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

module.exports = new UserController()