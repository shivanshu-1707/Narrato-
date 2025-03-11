import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(request:NextRequest){
  try {
    const body =await request.json();
    const {username,email,password} = body;
    if(!email || !username || !password){
      return NextResponse.json({error:"Missing Info",success:false},{status:400});
    }

    const user = await prisma.user.findUnique({
      where:{
        email:email
      }
    });

    if(user){
      return NextResponse.json({error:"Email is linked to another account",success:false},{status:400});
    }
    const hashedPass = await bcrypt.hash(password,12);
    const newUser = await prisma.user.create({
      data:{
        email:email,
        name:username,
        password:hashedPass,
      },
      select:{
        name:true,
        email:true,
        image:true,
      }

    });

    return NextResponse.json({sucess:true,data:newUser},{status:200});
  } catch (error) {
    console.log(error,"error occured while registering");
    return NextResponse.json({error:"Internal Server Error",sucess:false},{status:500});
  }
}