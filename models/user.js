import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'User email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 6,
    maxLength: 50,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please fill a valid Email address']
  },
  password: {
    type: String,
    required: [true, 'User password is required'],
    minLength: 6,
  },
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
}, { timestamps: true })

// before save the password transform it into hashed password
UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
})

// during login compare the user input password with the saved hashed password
UserSchema.methods.comparePasswords = async function (password) {
  return await bcrypt.compare(password, this.password)
}

// create JWT token when the user registers or logs in
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION })
}

export default mongoose.model('User', UserSchema)