import { TRPCError } from "@trpc/server";
import pdf from "pdf-parse";
import mammoth from "mammoth";

export async function parseAndValidateFile(
  file: Buffer,
  fileName: string,
): Promise<string> {
  const fileExtension = fileName.split(".").pop()?.toLowerCase();

  switch (fileExtension) {
    case "pdf":
      return await parsePDF(file);
    case "docx":
      return await parseDOCX(file);
    case "txt":
      return parseTextFile(file);
    default:
      throw new TRPCError({
        code: "BAD_REQUEST",
        message:
          "Unsupported file type. Please upload a PDF, DOCX, or TXT file.",
      });
  }
}

async function parsePDF(file: Buffer): Promise<string> {
  try {
    const data = await pdf(file);
    return data.text;
  } catch (error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid PDF file. Please check the file and try again.",
    });
  }
}

async function parseDOCX(file: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer: file });
    return result.value;
  } catch (error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid DOCX file. Please check the file and try again.",
    });
  }
}

function parseTextFile(file: Buffer): string {
  try {
    return file.toString("utf-8");
  } catch (error) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid text file. Please check the file and try again.",
    });
  }
}
