const { StatusCodes } = require('http-status-codes');
const { CustomApiError } = require('./error');
class BadrequestError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}
module.exports = BadrequestError;