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
// security packages
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import slowDown from 'express-slow-down'
import mongoSanitize from 'express-mongo-sanitize'
import { xss } from 'express-xss-sanitizer'
import helmet from 'helmet'
// swagger doc
import swaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'
const swaggerDocument = YAML.load('./swagger.yaml')

const app = express()
const PORT = process.env.PORT || 3000

// rate-limiting
app.use(slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 10, // allow 10 requests per 15 minutes
  delayMs: (hits) => hits * 100 // add 100 ms of delay to every requests after the 5th one
}))
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // Limit each IP to 20 requests per `window` (here, per 15 minutes).
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  message: {
    error: 'Too many requests, please try again later.'
  }
}))

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(mongoSanitize())
app.use(xss())
app.use(helmet())

// routes
app.get('/', (req, res) => res.send(`
  <h1>Social Media API</h1>
  <a href='/api-docs'>Swagger Docs</a>
`))
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', authorize, userRouter)
app.use('/api/v1/posts', authorize, postRouter)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, async () => {
  await connectDB()
  console.log(`Social Media API running on http://localhost:${PORT}`)
})