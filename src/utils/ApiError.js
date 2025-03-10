class ApiError extends Error{

    constructor(statusCode,
                message = "Something went wrong",
                errors =[],
                stach =""
    ){
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack;
        this.data=null;
        this.success=false;

        if(stack){
            this.stack=stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }
    }
}

export {ApiError};