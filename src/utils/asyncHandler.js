// USing Promisses 

const asyncHandler = (requestHandler) => {
    return (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)).
        catch((err)=> next(err))
    }
}

export {asyncHandler}




// Using Try Catch

//Higher Order Function ( Can accept function as parameter)

/*
const asyncHandler = () => {}
const asyncHandler = (fun) => () => {}
const asyncHandler = (fun) => async() => {}
*/


/*
const asyncHandler = (fun)=> async(req, res, next) =>{
    try {
        await fun(req,res,next);
    } catch (err) {
        res.status(err.code || 500).json({
            success : false,
            message : err.message
        })
    }
}
*/