import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { getFileType } from "@/app/helper/getFileType";

import {
  deleteFromCloudinary,
  uploadImageCloudinary,
} from "@/lib/cloudinary/cloudinary";
import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (req.method !== "POST") {
      return NextResponse.json(
        { error: "Method not allowed", success: false },
        { status: 405 }
      );
    }
    

    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser?.id || !currentUser?.email) {
      return NextResponse.json(
        { error: "Unauthorized", success: false },
        { status: 401 }
      );
    }

    const data = await req.formData();
    const file = data.get("file") as File | null;
    const title = data.get("title") as string;
    const name = data.get("name") as string+ "-" + String(Date.now());
    
    if (!file || !title) {
      return NextResponse.json(
        { error: "Missing file or title.", success: false },
        { status: 400 }
      );
    }
    
    // file type validation
    const fileType = getFileType(file.type);
    if (fileType!=="pdf" && fileType!=="pptx" ) {
      return NextResponse.json(
        { error: "Invalid file type", success: false },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);
    const response = await uploadImageCloudinary(fileBuffer);
    if (!response) {
      return NextResponse.json(
        { error: "Error uploading file to cloudinary", sucess: false },
        { status: 500 }
      );
    }

    //@ts-expect-error cloudinary api upload response
    const { secure_url, public_id } = response;
    if (!secure_url || !public_id) {
      return NextResponse.json(
        { error: "Error uploading file to cloudinary", success: false },
        { status: 500 }
      );
    }

    let newPresentation;
    try {
      newPresentation = await prisma.presentation.create({
        data: {
          link: secure_url,
          public_id: public_id,
          title: title,
          type: file.type,
          name:name,
          user: {
            connect: {
              id: currentUser.id,
            },
          },
        },
      });
    } catch (error) {
      await deleteFromCloudinary(public_id);
      console.log(error);
      throw error;
    }

    return NextResponse.json(
      { data: newPresentation, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error", success: false },
      { status: 500 }
    );
  }
}
