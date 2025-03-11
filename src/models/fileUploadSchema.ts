import { z } from "zod";

const validTypes = [
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const MAX_FILE_SIZE_MB = 2;

const fileUploadSchema = z.object({
  title: z
    .string()
    .min(4, { message: "Title should be at least 4 characters long" }),

  file: z
    .any() // Ensures file is a FileList
    .refine((files) => files.length > 0, {
      message: "Please upload a file",
    })
    .refine((files) => {
      const file = files.item(0);
      return file ? validTypes.includes(file.type) : false;
    }, {
      message: "Invalid file type. Please upload a PDF or PowerPoint (.ppt, .pptx) file",
    })
    .refine((files) => {
      const file = files.item(0);
      return file ? file.size <= MAX_FILE_SIZE_MB * 1024 * 1024 : false;
    }, {
      message: `File size should not exceed ${MAX_FILE_SIZE_MB} MB`,
    }),
});

export default fileUploadSchema;
