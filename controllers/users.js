import User from '../models/user.js'

// @desc   Get logged user details
// @route  GET /api/v1/users/me
export const getLoggedUser = async (req, res) => {
  const userId = req.user.userId
  const user = await User.findById(userId)

  res.status(200).json({
    name: user.name,
    numberOfFollower: user.followers.length,
    numberOfFollowing: user.following.length,
    numberOfPosts: user.posts.length
  })
}

// @desc   Get logged user posts
// @route  GET /api/v1/users/me/posts
export const getLoggedUserPosts = async (req, res) => {
  const userId = req.user.userId
  const user = await User.findById(userId).populate('posts', '-__v, -_id -author')

  if (user.posts.length === 0) return res.status(200).json({ message: 'No posts yet' })

  res.status(200).json({ posts: user.posts })
}

// @desc   Get logged user followers
// @route  GET /api/v1/users/me/followers
export const getLoggedUserFollowers = async (req, res) => {
  const userId = req.user.userId
  const user = await User.findById(userId).populate('followers', 'name')

  if (user.followers.length === 0) return res.status(200).json({ message: 'No followers yet' })

  res.status(200).json({ followers: user.followers })
}

// @desc   Get logged user following
// @route  GET /api/v1/users/me/following
export const getLoggedUserFollowing = async (req, res) => {
  const userId = req.user.userId
  const user = await User.findById(userId).populate('following', 'name')

  if (user.following.length === 0) return res.status(200).json({ message: 'No following yet' })

  res.status(200).json({ following: user.following })
}

// @desc   Follow User
// @route  POST /api/v1/users/me/following/:id
export const followUser = async (req, res) => {
  const userId = req.user.userId
  const targeUserId = req.params.id

  if (!targeUserId) throw Object.assign(new Error('Please provide user id'), { statusCode: 400 })

  const targetUser = await User.findById(targeUserId)
  if (!targetUser) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  await User.findByIdAndUpdate(userId, { $push: { following: targeUserId } }, { new: true })
  await User.findByIdAndUpdate(targeUserId, { $push: { followers: userId } }, { new: true })

  res.status(204).end()
}

// @desc   Unfollow User
// @route  DELETE /api/v1/users/me/following/:id
export const unfollowUser = async (req, res) => {
  const userId = req.user.userId
  const targeUserId = req.params.id

  if (!targeUserId) throw Object.assign(new Error('Please provide user id'), { statusCode: 400 })

  const targetUser = await User.findById(targeUserId)
  if (!targetUser) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  await User.findByIdAndUpdate(userId, { $pull: { following: targeUserId } }, { new: true })
  await User.findByIdAndUpdate(targeUserId, { $pull: { followers: userId } }, { new: true })

  res.status(204).end()
}

// @desc   Get user details
// @route  GET /api/v1/users/:id
export const getUser = async (req, res) => {
  const id = req.params.id
  const user = await User.findById(id)

  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  res.status(200).json({
    name: user.name,
    numberOfFollower: user.followers.length,
    numberOfFollowing: user.following.length,
    numberOfPosts: user.posts.length
  })
}

// @desc   Get user posts
// @route  GET /api/v1/users/:id/posts
export const getUserPosts = async (req, res) => {
  const id = req.params.id

  const user = await User.findById(id).populate('posts', '-_id -__v -author')
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

  const user = await User.findById(id).populate('followers')
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  const followers = user.followers

  if (followers.length === 0) return res.status(200).json({ message: 'No followers yet' })

  res.status(200).json({
    user: user.name,
    followers
  })
}

// @desc   Get user following
// @route  GET /api/v1/users/:id/following
export const getFollowing = async (req, res) => {
  const id = req.params.id

  const user = await User.findById(id).populate('following')
  if (!user) throw Object.assign(new Error('User not found'), { statusCode: 404 })

  const following = user.following

  if (following.length === 0) return res.status(200).json({ message: 'No following yet' })

  res.status(200).json({
    user: user.name,
    following
  })
}