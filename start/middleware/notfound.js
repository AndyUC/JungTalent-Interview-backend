const { StatusCodes } = require('http-status-codes');
const { CustomApiError } = require('./error');
class NotfoundError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.NOT_FOUND
    }
}
module.exports = NotfoundError;