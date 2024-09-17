/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'

// Middleware Centralized error handling
export const errorHandlingMiddleware = (err, req, res, next) => {

  // If statusCode is missing, the default code will be 500 INTERNAL_SERVER_ERROR
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR

  // Create a responseError variable to control what to return
  const responseError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // If there is an error without a message, get the standard Reason Phrases according to the Status Code
    stack: err.stack
  }
  console.error(responseError)

  // Trả responseError về phía Front-end
  res.status(responseError.statusCode).json(responseError)
}