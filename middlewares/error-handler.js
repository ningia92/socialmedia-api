// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const error = {
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500,
  }

  // mongoose bad data format
  if (err.name === 'CastError') {
    error.message = 'Invalid data format',
    error.statusCode = 400
  }

  // mongoose duplicate key
  if (error.code === 11000) {
    error.message = 'Duplicate key value entered',
    error.statusCode = 400
  }

  // mongoose validation error
  if (error.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(item => item.message).join(',')
    error.statusCode = 400
  }

  // jwt error
  if (error.name === 'JsonWebTokenError') {
    error.message = 'Invalid token',
    error.statusCode = 401
  }

  // jwt expired
  if (error.name === 'TokenExipiredError') {
    error.message = 'Expired token',
    error.statusCode = 401
  }

  console.error(err)
  return res.status(error.statusCode).json({ error: error.message })
}

export default errorHandler