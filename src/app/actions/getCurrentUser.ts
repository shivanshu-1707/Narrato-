import { prisma } from "@/lib/prisma";
import getSession from "./getSession";

export const getCurrentUser = async ()=>{
  try{
    const session = await getSession();
    if(!session?.user?.email){
      return null;
    }
    const currentUser = await prisma.user.findUnique({
      where:{
        email:session.user.email
      }
    });

    if(!currentUser) return null;

    return currentUser;
  } 
  catch(error){
    console.log(error);
    return null;
  }
}