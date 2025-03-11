import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


const ITEM_PER_PAGE = 12;

export async function GET(req:NextRequest){
  const title = req.nextUrl.searchParams.get('title') || "";
  const sortBy = req.nextUrl.searchParams.get('sortBy') || "desc";
  const pageNumber = parseInt(req.nextUrl.searchParams.get('pageNumber') || "1");
  try {
    const currentUser = await getCurrentUser();
    if(!currentUser || !currentUser.email){
      return NextResponse.json({message:"Unauthorized"},{status:401});
    }
    const presentations = await prisma.presentation.findMany({
      where:{
        userId: currentUser.id,
        title:{
          contains: title,
          mode: "insensitive",
        }
      },
      orderBy:{
        updatedAt: (sortBy==="asc")?"asc":"desc",
      },
      skip: (pageNumber-1)*ITEM_PER_PAGE,
      take:ITEM_PER_PAGE,
    });
    
    if(!presentations){
      return NextResponse.json({message:"No data Found",data:presentations},{status:200});
    }
    // console.log(presentations);
    return NextResponse.json({message:"sucessfully executed",data:presentations},{status:200});
  } catch (error) {
    return NextResponse.json({message:"Internal Server Error",reason:error},{status:500});
  }
  
  return NextResponse.json({message:"Recieved Request"});
}