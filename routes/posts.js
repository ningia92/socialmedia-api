import { Router } from 'express'
import { createPost, getPost, updatePost, deletePost, getUserPosts } from '../controllers/posts.js'
const postRouter = Router()

// path: /api/v1/posts
postRouter.post('/', createPost)
postRouter.route('/:id').get(getPost).patch(updatePost).delete(deletePost)
postRouter.get('/users/:id', getUserPosts)

export default postRouter