import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw Object.assign(new Error('Unauthorized'), { statusCode: 401 })
  }

  const token = authHeader.split(' ')[1]
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  const user = await User.findById(decoded.userId)
  if (!user) throw Object.assign(new Error('Unauthorized'), { statusCode: 401 })

  req.user = { userId: decoded.userId }

  next()
}

export default authorize