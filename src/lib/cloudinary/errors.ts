
class CloudinaryError extends Error{
  constructor(message:string,public readonly code?:string){
    super(message);
    this.name='CloudinaryError';
  }
} 

export {CloudinaryError}