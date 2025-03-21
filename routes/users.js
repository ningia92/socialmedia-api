import { Router } from 'express'
import {
  getUser,
  updateName,
  updatePassword,
  deleteUser,
  getUserPosts,
  getFollowers,
  getFollowings,
  followUser,
  unfollowUser
} from '../controllers/users.js'
const userRouter = Router()

// path: /api/v1/users
userRouter.route('/:id').get(getUser).delete(deleteUser)
userRouter.patch('/:id/name', updateName)
userRouter.patch('/:id/password', updatePassword)
userRouter.get('/:id/posts', getUserPosts)
userRouter.get('/:id/followers', getFollowers)
userRouter.get('/:id/followings', getFollowings)
userRouter.patch('/:id/follow', followUser)
userRouter.patch('/:id/unfollow', unfollowUser)

export default userRouter