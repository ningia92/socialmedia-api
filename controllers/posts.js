import Post from '../models/post.js'

// @desc   Create a post
// @route  POST /api/v1/posts
export const createPost = async (req, res) => {
  const { title, description } = req.body
  const userId = req.user.userId

  const post = await Post.create({ author: userId, title, description })

  res.status(201).json({
    message: 'Post created',
    post: {
      id: post._id,
      title: post.title,
      description: post.description,
      createdAt: post.createdAt
    }
  })
}

// @desc   Get a post
// @route  GET /api/v1/posts/:id
export const getPost = async (req, res) => {
  const id = req.params.id
  const post = await Post.findById(id).select('-__v -_id')

  if (!post) throw Object.assign(new Error('Post not found'), { statusCode: 404 })

  res.status(200).json({ post })
}

// @desc   Update post (only post owner)
// @route  PATCH /api/v1/posts/:id
export const updatePost = async (req, res) => {
  const id = req.params.id

  const { title, description } = req.body
  if (!title && !description) throw Object.assign(new Error('Fields cannot be empty'), { statusCode: 400 })

  const post = await Post.findById(id)
  if (!post) throw Object.assign(new Error('Post not found'), { statusCode: 404 })

  if (req.user.userId !== String(post.author)) throw Object.assign(new Error('Forbidden'), { statusCode: 403 })

  await Post.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true })

  res.status(204).end()
}

// @desc   Remove post (only post owner)
// @route  DELETE /api/v1/posts/:id
export const deletePost = async (req, res) => {
  const id = req.params.id
  const userId = req.user.userId

  const post = await Post.findById(id)
  if (!post) throw Object.assign(new Error('Post not found'), { statusCode: 404 })

  if (userId !== String(post.author)) throw Object.assign(new Error('Forbidden'), { statusCode: 403 })

  await post.deleteOne()

  res.status(204).end()
}