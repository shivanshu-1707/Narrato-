import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { deleteFromCloudinary } from "@/lib/cloudinary/cloudinary";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req:NextRequest){
  try {
    const user = await getCurrentUser();
    if(!user){
      return NextResponse.json({message:"Unauthorized"},{status:401});
    }
    const body = await req.json();
    const {pid} = body;
    if(!pid){
      return NextResponse.json({message:"Missing data"},{status:400});
    }
    
    const presentation = await prisma.presentation.delete({
      where:{
        id:pid,
        userId:user.id
      },
    }) ;
    
    if(!presentation){
      return NextResponse.json({message:"No presentation found"},{status:400});
    }
    const delResponse = await deleteFromCloudinary(presentation.public_id);
    if(delResponse) console.log(delResponse);
    return NextResponse.json({presentation,message:"Successfull"},{status:200});

  } 
  catch (error) {
    console.log(error);
    return NextResponse.json({message:"Internal server Error"},{status:500});
  }
}