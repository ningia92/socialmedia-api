import User from '../models/user.js'

export const getUser = async (req, res) => {
  const id = req.params.id

  const user = await User.findById(id).select('-_id -password -createdAt -updatedAt -__v')

  if (req.user.userId !== id) throw Object.assign(new Error('Forbidden resource'), { statusCode: 403 })

  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  res.status(200).json({ user })
}