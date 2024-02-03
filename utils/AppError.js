try {
class AppError extends Error {
        constructor(message, statusCode) {
            console.log(message, statusCode)
            super(message);
            this.statusCode = statusCode;
            this.staus = `${statusCode}`.startsWith('4') ? 'fail': 'error';
            this.isOperational = true;
    
            Error.captureStackTrace(this, this.constructor);
        }
            
    }
    } catch (error) {
        console.log(error)
    }

module.exports = AppError;