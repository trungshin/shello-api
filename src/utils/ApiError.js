class ApiError extends Error {
  constructor(statusCode, message) {
    // Call the constructor of the Error class (parent class) to still use this
    // The parent Class (Error) already has a property message, so call it in super for brevity
    super(message)

    // Name of this custom Error, if not set, it will inherit "Error" by default
    this.name = 'ApiError'

    // Assign http status code here
    this.statusCode = statusCode

    // Record the Stack Trace to facilitate debugging
    Error.captureStackTrace(this, this.constructor)
  }
}

export default ApiError