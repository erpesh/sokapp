import {NextApiRequest, NextApiResponse} from "next";
import {stripe} from "@/lib/stripe";
import absoluteUrl from "../../utils/absoluteUrl";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const body = JSON.parse(req.body);

  switch (method) {
    case 'POST':
      try {
        // create a payment intent

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          billing_address_collection: "auto",
          customer_email: body.userEmail,
          line_items: [
            {
              price_data: {
                currency: "gbp",
                unit_amount: body.amount * 100,
                product_data: {
                  name: body.description,
                },
              },
              quantity: 1,
            },
          ],
          payment_intent_data: {
            application_fee_amount: 30,
            transfer_data: {
              destination: body.stripeId,
            },
          },
          mode: "payment",
          success_url: absoluteUrl("/payment-success?session_id={CHECKOUT_SESSION_ID}"),
          cancel_url: absoluteUrl(body.cancel_url),
          metadata: body.metadata,
        });
        // return the client secret to confirm the payment on the frontend
        res.status(200).json({url: session.url});
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: error });
      }
      break;

    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}