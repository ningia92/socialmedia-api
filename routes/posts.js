import { Router } from 'express'
import { getPosts, createPost, getPost, updatePost, deletePost, likeDislikePost } from '../controllers/posts.js'
const postRouter = Router()

// path: /api/v1/posts
postRouter.route('/').get(getPosts).post(createPost)
postRouter.route('/:id').get(getPost).patch(updatePost).delete(deletePost)
postRouter.patch('/:id/like', likeDislikePost)

export default postRouter