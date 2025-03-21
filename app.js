import express from 'express'
import 'express-async-errors'
import morgan from 'morgan'
import connectDB from './database/mongodb.js'
import authRouter from './routes/auth.js'
import userRouter from './routes/users.js'
import postRouter from './routes/posts.js'
import notFound from './middlewares/not-found.js'
import errorHandler from './middlewares/error-handler.js'
import authorize from './middlewares/auth.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(morgan('dev'))
app.use(express.json())

app.get('/', (req, res) => res.send('<h1>Social Media API</h1>'))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authorize, userRouter)
app.use('/api/v1/posts', authorize, postRouter)

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, async () => {
  await connectDB()
  console.log(`Social Media API running on http://localhost:${PORT}`)
})