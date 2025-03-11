import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./getCurrentUser";

async function getPresentationById(id:string){
  try {
    const user = await getCurrentUser();
    if(!user?.id){
      return null;
    }
    const presentation = await prisma.presentation.findUnique({
      where:{
        id:id,
        userId:user.id,
      }
    });
    if(!presentation){
      console.log("No matching presentation found for the user");
      return null;
    }
    return presentation;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default getPresentationById;