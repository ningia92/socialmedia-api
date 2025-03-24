import User from '../models/user.js'

// @desc   Register user
// @route  POST /api/v1/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) throw Object.assign(new Error('User already exists'), { statusCode: 400 })

  const user = await User.create({ name, email, password })
  const token = user.createJWT()

  res.status(201).json({
    message: 'User registered',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      token: token
    }
  })
}

// @desc   Login user
// @route  POST /api/v1/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) throw Object.assign(new Error('Please provide email and password'), { statusCode: 400 })

  const user = await User.findOne({ email })
  if (!user) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })

  const validPassword = await user.comparePasswords(password)
  if (!validPassword) throw Object.assign(new Error('Invalid credentials'), { statusCode: 401 })

  const token = user.createJWT()

  res.status(200).json({
    message: 'User logged in',
    user: {
      id: user._id,
      name: user.name,
      token: token
    }
  })
}