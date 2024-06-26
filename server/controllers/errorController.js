const AppError = require("../utils/appError");

const handleCastErrorDB=(err)=>{
 const message=`Invalid ${err.path} : ${err.value}`;
 return new AppError(message,400); 
}
const handleDuplicateValueDB =(err)=>{
  const firstKey = Object.keys(err.keyValue)[0];
 const message= `Duplicate Feild value : ${err.keyValue[firstKey]} . please use differnet value.`;
 return new AppError(message,400);
}
const handleValidationErrorDB =(err)=>{
 // const message =``
 return new AppError(err.message,400);
}
const handleJWTError =(err)=>{
 // const message =``
 return new AppError("Invalid token , Please Login again",401);
}
const handleExpiredJWTError =(err)=>{
 // const message =``
 return new AppError("Your Login Expired , Please Login again",401);
}


const sendErrorDev =(err,res)=>{
  res.status(err.statusCode).json({
   status:err.status,
   error:err,
   message:err.message,
   stack:err.stack
  });
};

const sendErrorProd =(err,res)=>{
 // for operational errors
 if(err.isOperational){
  res.status(err.statusCode).json({
   status:err.status,
   message:err.message
  });

  // programming or other unknown  error
 }else{
   console.error('ERROR',err); 
  res.status(500).json({
   status:'error',
   message:"Something went wrong !",
  })
 }
};





module.exports=(err,req,res,next)=>{

 err.statusCode = err.statusCode || 500 ;
 err.status = err.status || 'error';

 if(process.env.NODE_ENV==='development'){
  sendErrorDev(err,res);
 }else if(process.env.NODE_ENV==='production'){
  let error = {...err};
  if(err.name==="CastError") error=handleCastErrorDB(err);
  if(err.code===11000) error=handleDuplicateValueDB(err);
  if(err.name==="ValidationError") error=handleValidationErrorDB(err);
  if(err.name==="JsonWebTokenError") error=handleJWTError(err);
  if(err.name==="TokenExpiredError") error=handleExpiredJWTError(err);
  
  sendErrorProd(err,res);
 }


};