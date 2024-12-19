class appError extends Error {
    constructor(message, statusCode, statusText) {
      super(message);
      this.statusCode = statusCode;
      this.statusText = statusText;
      Error.captureStackTrace(this, this.constructor);
    }
  
    static create(message, statusCode, statusText) {
      return new appError(message, statusCode, statusText);
    }
  }
  
  module.exports = appError;