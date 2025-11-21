import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import logger from "@/lib/logger";
import { requestContext } from "@/lib/observability/context";
import { metrics } from "@/lib/observability/metrics";
import { ValidationError, DatabaseError, handleError } from "@/lib/observability/errors";

export async function POST(req: Request) {
  const ctx = requestContext.create({
    path: '/api/auth/register',
    method: 'POST',
  });

  try {
    const { name, email, password } = await req.json();

    logger.info('User registration attempt', {
      requestId: ctx.requestId,
      email,
      hasName: !!name,
    });

    // Basic validation
    if (!name || !email || !password) {
      throw new ValidationError("Missing required fields", {
        missingFields: {
          name: !name,
          email: !email,
          password: !password,
        },
      });
    }

    // Check if user already exists
    const existingUser = await metrics.trackQuery('findUnique:user', () =>
      prisma.user.findUnique({ where: { email } })
    );

    if (existingUser) {
      logger.warn('Registration failed: email already exists', {
        requestId: ctx.requestId,
        email,
      });

      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await metrics.trackQuery('create:user', async () => {
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Create initial user balance
      await prisma.userBalance.create({
        data: {
          userId: newUser.id,
          credits: 100,
        },
      });

      return newUser;
    });

    const duration = requestContext.getDuration(ctx.requestId);

    logger.audit('User registered', {
      requestId: ctx.requestId,
      userId: user.id,
      email: user.email,
      duration,
    });

    // Return the user without the password
    const { password: _, ...userWithoutPassword } = user;

    requestContext.delete(ctx.requestId);

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    const duration = requestContext.getDuration(ctx.requestId);

    if (error instanceof ValidationError) {
      logger.warn('Registration validation failed', {
        requestId: ctx.requestId,
        error: error.message,
        details: error.details,
        duration,
      });

      requestContext.delete(ctx.requestId);

      return NextResponse.json(
        { message: error.message, details: error.details },
        { status: error.statusCode }
      );
    }

    const errorResponse = handleError(error as Error, {
      requestId: ctx.requestId,
      endpoint: '/api/auth/register',
      duration,
    });

    requestContext.delete(ctx.requestId);

    return NextResponse.json(
      { message: "Error registering user", error: errorResponse.error },
      { status: errorResponse.statusCode }
    );
  }
}