export class AleradyExistError extends Error {  
    status: number
    name: string

    constructor (message: string) {
      super(message)
      Error.captureStackTrace(this, this.constructor);
  
      this.name = this.constructor.name
      this.status = 400
    }
  
    statusCode() {
      return this.status
    }
  }
  
 