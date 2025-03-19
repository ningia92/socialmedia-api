import User from '../models/user.js'

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) throw Object.assign(new Error('User already exists'), { statusCode: 400 })

  const user = await User.create({ name, email, password })
  const token = user.createJWT()

  res.status(201).json({
    message: 'User registered',
    user: {
      name: user.name,
      id: user._id,
      token: token
    }
  })
}

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
      name: user.name,
      id: user._id,
      token: token
    }
  })
}