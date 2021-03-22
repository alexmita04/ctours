// This is a class for throwing operational errors
class AppError extends Error {
  constructor(message, statusCode) {
    // accessing the message property from the
    // Error class
    super(message);

    this.statusCode = statusCode;

    // if the status code starts with 4 we'll mark the
    // error status as fail, and if it's not we'll mark
    // it as error
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // We'll throw this error just for operational errors
    // so that is why we'll set the .isOperational to true
    this.isOperational = true;
  }
}

// Exporting the AppError class
module.exports = AppError;
