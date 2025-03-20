import { Router } from 'express'
import { 
  getLoggedUser,
  getLoggedUserPosts,
  getLoggedUserFollowers,
  getLoggedUserFollowing,
  followUser,
  unfollowUser,
  getUser,
  getUserPosts,
  getFollowers,
  getFollowing,
} from '../controllers/users.js'
const userRouter = Router()

// path: /api/v1/users
// routes for the logged user
userRouter.get('/me', getLoggedUser)
userRouter.get('/me/posts', getLoggedUserPosts)
userRouter.get('/me/followers', getLoggedUserFollowers)
userRouter.get('/me/following', getLoggedUserFollowing)
userRouter.post('/me/following/:id', followUser)
userRouter.delete('/me/following/:id', unfollowUser)
// routes to get info of other users
userRouter.get('/:id', getUser)
userRouter.get('/:id/posts', getUserPosts)
userRouter.get('/:id/followers', getFollowers)
userRouter.get('/:id/following', getFollowing)

export default userRouter