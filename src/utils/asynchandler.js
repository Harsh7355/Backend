const asynchandler = (fn) =>async(req,res,next) =>{
  try{
    await fn(req,res,next)

  }
  catch(error){
    console.log("Error",error)
    res.status(400).json({
      err:error,
      msg:"Something went wrong",
      success:"fail"
    })
    next(error)
  }

}
export default asynchandler