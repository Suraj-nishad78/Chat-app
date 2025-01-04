
export class customErrorHandler extends Error {
    constructor(statusCode, errMessage) {
      super(errMessage);
      this.statusCode = statusCode;
    }
}

export const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof customErrorHandler) {
      return res.status(err.statusCode).json({
        status:"FAILED",
        msg:err.message
    });
    } else {
      return res.status(500).json({
        status:"FAILED",
        msg:"oops! something went wrong...Try again later!"
      });
    }
};