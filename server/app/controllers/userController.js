const {User} = require('../models')
const jwt = require('jsonwebtoken')

class UserController {
    async findOneByIp(req, res) {
      const {ip} = req.params
      const user = await User.findOne(
          {
              where: {ip},
          },
      )

      if (user) {
        const token = generateJwt(user.id, user.email, user.ip)
        return res.json({
          userFound: true,
          token
        })
      }
      return res.json({
        userFound: false
      })
    };
}

const generateJwt = (id, email, ip) => {
  return jwt.sign(
      {id, email, ip},
      process.env.SECRET_KEY
  )
}

module.exports = new UserController()