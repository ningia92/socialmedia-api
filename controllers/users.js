import User from '../models/user.js'

// @desc   Get user
// @route  GET /api/v1/users/:id
export const getUser = async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id)

  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  res.status(200).json(user)
}

// @desc   Update user name
// @route  PATCH /api/v1/users/:id/name
export const updateName = async (req, res) => {
  const userId = req.user.userId
  const id = req.params.id
  if (userId !== id) throw Object.assign(new Error(`You can't update someone else's name`), { statusCode: 403 })

  const name = req.body
  if (!name) throw Object.assign(new Error('Name field cannot be empty'), { statusCode: 400 })

  await User.findByIdAndUpdate(userId, name, { new: true })

  res.status(204).end()
}

// @desc   Update user password
// @route  PATCH /api/v1/users/:id/password
export const updatePassword = async (req, res) => {
  const userId = req.user.userId
  const id = req.params.id
  if (userId !== id) throw Object.assign(new Error(`You can't update someone else's password`), { statusCode: 403 })

  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    throw Object.assign(new Error('You must provide both your current password and your new password'), { statusCode: 400 })
  }

  const user = await User.findById(userId)

  const isMatch = await user.comparePasswords(currentPassword)
  if (!isMatch) throw Object.assign(new Error('Current password is incorrect'), { statusCode: 401 })

  user.password = newPassword
  await user.save()

  res.status(204).end()
}

// @desc   Delete user
// @route  DELETE /api/v1/users/:id
export const deleteUser = async (req, res) => {
  const userId = req.user.userId
  const id = req.params.id

  if (userId !== id) throw Object.assign(new Error(`You can't delete other user`), { statusCode: 403 })

  await User.findByIdAndDelete(userId)

  res.status(204).end()
}

// @desc   Get user posts
// @route  GET /api/v1/users/:id/posts
export const getUserPosts = async (req, res) => {
  const id = req.params.id

  const user = await User.findById(id).populate('posts', '-author')
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  if (user.posts.length === 0) return res.status(200).json({ message: 'No posts yet' })

  const posts = user.posts

  res.status(200).json({
    author: user.name,
    posts
  })
}

// @desc   Get user followers
// @route  GET /api/v1/users/:id/followers
export const getFollowers = async (req, res) => {
  const id = req.params.id

  const user = await User.findById(id).populate('followers', 'name email')
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  const followers = user.followers

  if (followers.length === 0) return res.status(200).json({ message: 'No followers yet' })

  res.status(200).json({
    user: user.name,
    followers
  })
}

// @desc   Get user followings
// @route  GET /api/v1/users/:id/followings
export const getFollowings = async (req, res) => {
  const id = req.params.id

  const user = await User.findById(id).populate('followings', 'name email')
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  const followings = user.followings

  if (followings.length === 0) return res.status(200).json({ message: 'No followings yet' })

  res.status(200).json({
    user: user.name,
    followings
  })
}

// @desc   Follow User
// @route  PATCH /api/v1/users/:id/follow
export const followUser = async (req, res) => {
  const userId = req.user.userId
  const targetUserId = req.params.id

  const targetUser = await User.findById(targetUserId)
  if (!targetUser) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  if (userId === targetUserId) throw Object.assign(new Error(`You can't follow yourself`), { statusCode: 403 })

  if (targetUser.followers.includes(userId)) {
    throw Object.assign(new Error('You already follow this user'), { statusCode: 403 })
  }

  await User.findByIdAndUpdate(userId, { $push: { followings: targetUserId } }, { new: true })
  await User.findByIdAndUpdate(targetUserId, { $push: { followers: userId } }, { new: true })

  res.status(204).end()
}

// @desc   Unfollow User
// @route  PATCH /api/v1/users/:id/unfollow
export const unfollowUser = async (req, res) => {
  const userId = req.user.userId
  const targetUserId = req.params.id

  const targetUser = await User.findById(targetUserId)
  if (!targetUser) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  if (userId === targetUserId) throw Object.assign(new Error(`You can't unfollow yourself`), { statusCode: 403 })

  if (!targetUser.followers.includes(userId)) {
    throw Object.assign(new Error(`You don't follow this user`), { statusCode: 403 })
  }

  await User.findByIdAndUpdate(userId, { $pull: { followings: targetUserId } }, { new: true })
  await User.findByIdAndUpdate(targetUserId, { $pull: { followers: userId } }, { new: true })

  res.status(204).end()
}