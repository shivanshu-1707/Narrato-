import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
  try {
    const user  = await getCurrentUser();
    if(!user || !user.email || !user.email){
      return NextResponse.json({error:"Unauthorized"},{status:401});
    }
    const {pid} = await req.json();
    if(!pid){
      return NextResponse.json({error:"Missing PID"},{status:400});
    }

    const narration = await prisma.presentation.findUnique({
      where:{
        id:pid,
      },
      select:{
        script:true,
      }
    });

    if(!narration){
      return NextResponse.json({message:"No narration Generated",narration:null},{status:200});
    }
    return NextResponse.json({narration:narration.script},{status:200});    
  } catch (error) {
    console.error(error);
    return NextResponse.json({error:"Internal Server Error"},{status:500});
  }
}