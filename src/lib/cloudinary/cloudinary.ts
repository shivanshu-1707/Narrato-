"use server";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryError } from "./errors";
import { getFileType } from "@/app/helper/getFileType";
import { z } from "zod";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CloudinaryInputOptionsSchema = z.union([
  z.object({ file: z.instanceof(File) }),
  z.object({
    buffer: z.instanceof(ArrayBuffer),
    type: z.enum(["pdf", "pptx"]),
  }),
]);

type CloudinaryInputType = z.infer<typeof CloudinaryInputOptionsSchema>;

export const uploadImageCloudinary = async (input: Buffer<ArrayBufferLike>) => {
  try {
    if(!Buffer.isBuffer(input)){
      throw new CloudinaryError("Input must be a valid buffer");
    }
    if(input.length===0){
      throw new CloudinaryError("Buffer is Empty");
    }
    const buffer = Buffer.from(input);
    return new Promise((resolve, reject) => {
      console.log("Uploading..");
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "auto",
            folder: process.env.CLOUDINARY_FOLDERNAME,
          },
          async (error, res) => {
            if (error) {
              reject(new CloudinaryError(error.message));
            }
            console.log(res);
            console.log("Uploaded")
            return resolve(res);
          }
        )
        .end(buffer);
    });
  } catch (error) {
    if (error instanceof CloudinaryError) {
      throw error;
    }
    throw new CloudinaryError(
      `Unexpected Error During Upload: ${
        error instanceof Error ? error.message : "Unknown Error"
      }`
    );
  }
};

export const uploadFileCloudinary = async (input: CloudinaryInputType) => {
  try {
    const parsed = CloudinaryInputOptionsSchema.safeParse(input);
    if (!parsed.success) {
      throw new Error(
        "Invalid Input: Provide either a file or an array buffer with type"
      );
    }
    let bytes: Buffer;
    let format: string;
    if ("file" in input) {
      const file = input.file;
      format = getFileType(file.type);

      const buffer = await file.arrayBuffer();
      bytes = Buffer.from(buffer);
    } else {
      const { buffer, type } = input;
      bytes = Buffer.from(buffer);
      format = type;
    }

    return new Promise(async (resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "raw",
            folder: process.env.CLOUDINARY_FOLDERNAME,
            format: format,
          },
          async (error, res) => {
            if (error) {
              reject(new CloudinaryError(error.message));
            }

            console.log("asset uploaded", res);
            return resolve(res);
          }
        )
        .end(bytes);
    });
  } catch (error) {
    if (error instanceof CloudinaryError) {
      throw error;
    }
    throw new CloudinaryError(
      `Unexpected Error During Upload: ${
        error instanceof Error ? error.message : "Unknown Error"
      }`
    );
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    if (!publicId) return new CloudinaryError("publicId of asset not provided");

    return new Promise(async (resolve, reject) => {
      cloudinary.uploader.destroy(
        publicId,
        { resource_type: "raw" },
        (error, res) => {
          if (error) {
            reject(new CloudinaryError(error.message));
          }
          console.log("asset deleted", res);
          console.log(res);
          resolve(res);
        }
      );
    });
  } catch (error) {
    if (error instanceof CloudinaryError) throw error;

    throw new CloudinaryError(
      `Unexpected Error during upload:${
        error instanceof Error ? error.message : "Unknown Error"
      }`
    );
  }
};
