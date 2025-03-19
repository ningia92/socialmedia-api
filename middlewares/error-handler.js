const errorHandler = (err, req, res, next) => {
  const error = {
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500,
  }

  // mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found',
    error.statusCode = 404
  }

  // mongoose duplicate key
  if (error.code === 11000) {
    error.message = 'Duplicate key value entered',
    error.statusCode = 400
  }

  // mongoose validation error
  if (error.code === 'ValidationError') {
    error.message = Object.values(err.errors).map(item => item.message).join(',')
    error.statusCode = 400
  }

  console.error(err)
  return res.status(error.statusCode).json({ error: error.message })
}

export default errorHandler