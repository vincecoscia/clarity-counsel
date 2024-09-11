import { z } from "zod";
import { TRPCError } from "@trpc/server";
import {
  createTRPCRouter,
  protectedProcedure,
  fileUploadProcedure,
} from "~/server/api/trpc";
import { parseAndValidateFile } from "~/utils/fileParser"; // Adjust the import path as necessary
import { simplifyDocument } from "~/server/ai/claude";
import { SubscriptionService } from "~/server/services/subscriptionService";

export const documentRouter = createTRPCRouter({
  upload: protectedProcedure
  .input(
    z.object({
      file: z.string(),
      title: z.string(),
      fileName: z.string(),
      mimeType: z.string(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    console.log("Received input:", {
      file: input.file ? "Base64 string received" : "No file received",
      title: input.title,
      fileName: input.fileName,
      mimeType: input.mimeType,
    });

    // Decode base64 to buffer
    const fileBuffer = Buffer.from(input.file, 'base64');

    // Parse and validate the file
    let content: string;
    try {
      content = await parseAndValidateFile(fileBuffer, input.fileName);
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "An error occurred while processing the file.",
      });
    }

    // Create the document
    const document = await ctx.db.document.create({
      data: {
        title: input.title,
        content: content,
        userId: ctx.session.user.id,
      },
    });

    return document;
  }),

  simplify: protectedProcedure
  .input(z.string())
  .mutation(async ({ ctx, input }) => {
    const document = await ctx.db.document.findUnique({
      where: { id: input },
      include: { simplifications: true },
    });

    if (!document || document.userId !== ctx.session.user.id) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Document not found",
      });
    }

    // Check if simplification already exists
    if (document.simplifications.length > 0) {
      return document.simplifications[0];
    }

    const subscriptionService = new SubscriptionService(ctx.db);

    // Check and decrement usage
    try {
      await subscriptionService.checkAndDecrementUsage(ctx.session.user.id);
    } catch (error) {
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to check subscription usage",
      });
    }

    try {
      const simplifiedContent = await simplifyDocument(document.content);

      const simplification = await ctx.db.simplification.create({
        data: {
          documentId: document.id,
          simplifiedContent,
        },
      });

      return simplification;
    } catch (error) {
      console.error('Error during document simplification:', error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to simplify document. Please try again later.",
      });
    }
  }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { db, session } = ctx;

    const documents = await db.document.findMany({
      where: { userId: session.user.id },
      include: { simplifications: true },
      orderBy: { uploadedAt: "desc" },
    });

    return documents;
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const document = await ctx.db.document.findUnique({
        where: { id: input },
        include: { simplifications: true },
      });

      if (!document || document.userId !== ctx.session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found",
        });
      }

      return document;
    }),

  getAllIds: protectedProcedure
    .query(async ({ ctx }) => {
      const documents = await ctx.db.document.findMany({
        where: { userId: ctx.session.user.id },
        select: { id: true },
        orderBy: { uploadedAt: 'desc' },
      });

      return documents.map(doc => doc.id);
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { db, session } = ctx;

      const document = await db.document.findUnique({
        where: { id: input },
      });

      if (!document || document.userId !== session.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found or you don't have permission to delete it.",
        });
      }

      await db.document.delete({
        where: { id: input },
      });

      return { success: true };
    }),
});