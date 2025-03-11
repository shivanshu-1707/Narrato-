import { validTypes } from "../types/fileTypes"

export const getFileType = (mime:string)=>{
  if(mime==validTypes[0]){
    return "pdf";
  }
  return "pptx";
}