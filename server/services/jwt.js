const jwt = require('jwt-simple')
const moment = require('moment')

const secret = 'Password1_to2_decode3_token4_Project5_Social6_Red7'

const createToken = user => {
  const payload = {
    id: user.id,
    name: user.name,
    surname: user.surname,
    nickname: user.nickname,
    email: user.email,
    role: user.role,
    image: user.image,
    iat: moment().unix(),
    exp: moment().add(30, 'days').unix(),
  }
  return jwt.encode(payload, secret)
}

module.exports = { createToken, secret }
