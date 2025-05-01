import { HandleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutSessionCompleted";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Add export config to mark this as an edge-compatible API Route
export const config = {
  runtime: 'edge',
};

export async function POST(request: Request){
    const body = await request.text();
    const signature = headers().get("stripe-signature") as string;

    try {
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
        console.log("@STRIPE EVENT", event.type);
        switch(event.type) {
            case "checkout.session.completed":
                await HandleCheckoutSessionCompleted(event.data.object);
                break;
            default:
                break;
        }

        console.log("@@EVENT", event.type);

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return new Response("Webhook Error", { status: 400 });
    }
}