import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import logger from "@/lib/logger";
import { requestContext } from "@/lib/observability/context";
import { metrics } from "@/lib/observability/metrics";
import { handleError } from "@/lib/observability/errors";

// Ensure Node.js runtime for Winston/fs/crypto support
export const runtime = 'nodejs';

export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get("stripe-signature") as string;

    // Create request context for observability
    const ctx = requestContext.create({
        path: '/api/webhooks/stripe',
        method: 'POST',
    });

    try {
        if (!signature) {
            logger.warn('Stripe webhook missing signature', { requestId: ctx.requestId });
            return new NextResponse("Missing signature", { status: 400 });
        }

        // Track webhook receipt
        metrics.trackAPICall('stripe_webhook_received', () => Promise.resolve());

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (error: any) {
            logger.error('Invalid Stripe signature', {
                error: error.message,
                requestId: ctx.requestId
            });
            return new NextResponse("Invalid signature", { status: 400 });
        }

        const session = event.data.object as Stripe.Checkout.Session;

        logger.info(`Processing Stripe event: ${event.type}`, {
            type: event.type,
            eventId: event.id,
            requestId: ctx.requestId
        });

        if (event.type === "checkout.session.completed") {
            if (!session.metadata?.userId) {
                logger.error('Stripe session missing userId metadata', {
                    sessionId: session.id,
                    requestId: ctx.requestId
                });
                return new NextResponse("Missing metadata", { status: 400 });
            }

            // Track successful payment processing
            await metrics.trackAPICall('process_payment', async () => {
                await prisma.userBalance.upsert({
                    where: { userId: session.metadata?.userId },
                    create: {
                        userId: session.metadata?.userId!,
                        credits: 3000, // TODO: Make this dynamic based on plan
                    },
                    update: {
                        credits: { increment: 3000 },
                    },
                });
            });

            logger.audit('User purchased credits', {
                userId: session.metadata.userId,
                amount: session.amount_total,
                currency: session.currency,
                credits: 3000,
                requestId: ctx.requestId
            });
        }

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        const errorResponse = handleError(error, ctx);
        return NextResponse.json(errorResponse, { status: errorResponse.statusCode });
    } finally {
        // Clean up context
        const duration = requestContext.getDuration(ctx.requestId);
        logger.info('Stripe webhook processed', {
            requestId: ctx.requestId,
            duration,
            statusCode: 200 // Simplified for finally block
        });
        requestContext.delete(ctx.requestId);
    }
}