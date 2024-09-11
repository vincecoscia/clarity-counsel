import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerAuthSession } from "~/server/auth";
import { db } from "~/server/db";
import formidable from 'formidable';

interface CreateContextOptions {
  session: Session | null;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    db,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  return {
    ...createInnerTRPCContext({ session }),
    req,
    res,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

const handleFileUploadMiddleware = t.middleware(async ({ ctx, next }) => {
  if (ctx.req && !ctx.req.body && ctx.req.headers['content-type']?.includes('multipart/form-data')) {
    const form = formidable({ multiples: false });
    
    await new Promise<void>((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        if (err) {
          reject(err);
          return;
        }
        
        ctx.req.body = {
          title: fields.title?.[0],
          fileName: fields.fileName?.[0],
          file: files.file?.[0],
        };
        resolve();
      });
    });
  }
  
  console.log("Middleware parsed body:", JSON.stringify(ctx.req.body, (key, value) =>
    value instanceof Object && 'filepath' in value ? 'File object' : value
  ));
  
  return next();
});

export const publicProcedure = t.procedure.use(timingMiddleware);

export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });

export const fileUploadProcedure = protectedProcedure.use(handleFileUploadMiddleware);