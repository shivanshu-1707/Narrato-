import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
  try {
    const {pid,rawNarration} = await req.json();
    
    if(!pid || !rawNarration){
      return NextResponse.json({error:"Missing data"},{status:400});
    }

    const currentUser = await getCurrentUser();
    if(!currentUser || !currentUser.email || !currentUser.name){
      return NextResponse.json({error:"Unauthorized"},{status:401});
    }
    const existingScript = await prisma.script.findUnique({
      where:{sourceId:pid},
    });
    const newNarration = existingScript? await prisma.script.update({
      where:{sourceId:pid},
      data:{content:rawNarration}
    }): await prisma.script.create({
      data:{
        content:rawNarration,
        sourceId:pid,
      },
    });
    
    if(!newNarration){
      return NextResponse.json({error:"Internal server error"},{status:500});
    }
    return NextResponse.json({success:true,data:newNarration},{status:200});
  } catch (error) {
    console.log(error,"Error occured while saving script to db");
    return NextResponse.json({error:"Internal Server Error"},{status:500});
  }
}