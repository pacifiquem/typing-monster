const ErrorResponse = require('../utils/errorResponse.utils');


const errorHandler = (err, req, res, next) => {
  console.log(err);
  let error = { ...err };
  error.massage = err.message;
  error = req.error;


  //typeerror
  if(err.name === "TypeError") {

    const message = `there is problem but the team is working on it`;
    error = new ErrorResponse(message, 404);

  }

  // referenceError and syntaxError in codes
  if(err.name === "ReferenceError" || err.name === "SyntaxError") {
    
    const message = `there is problem but the team is working on it`;
    error = new ErrorResponse(message, 404);
  }

  // mongoose duplicate_Key
  if(err.code == 11000) {

    const message = `dupicate Key detected`;
    error = new ErrorResponse(message, 400);

  }

  //mongoose ObjectParameterError
  if(err.name === "ObjectParameterError") {

      const message = `the parameters isn't objectId`;
      error = new ErrorResponse(message, 400);
  }

 // mongoose validation_errors
  if(err.name === "ValidationError"){

    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }

  // mongoose object_ID
  if(err.name === "CastError") {

    const message = `user not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);

  } 

  // mongoose connection refused
  if(err.code == "EREFUSED" || err.name == "MongoWriteConcernError") {
    process.exit();
  }

  //JsonWebTokenError
  if(err.name === "JsonWebTokenError") {
    const message = "not Authorized to access this route";
    error = new ErrorResponse(message, 401)
  }

  //new unknown error
  if(error.statusCode === undefined || error.message === undefined) {
    
    const message = `there is problem but the team is working on it`;
    error = new ErrorResponse(message, 404);

  }

  console.log(error);

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
    check: error.path
  });
}

module.exports = errorHandler;