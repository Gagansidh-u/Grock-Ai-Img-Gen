
'use server';

import Razorpay from 'razorpay';
import { z } from 'zod';

const CreateOrderSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().length(3),
});

export async function createOrder(input: z.infer<typeof CreateOrderSchema>) {
  const validatedInput = CreateOrderSchema.safeParse(input);
  if (!validatedInput.success) {
    throw new Error('Invalid input for createOrder');
  }

  const { amount, currency } = validatedInput.data;

  const instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

  const options = {
    amount: amount,
    currency: currency,
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const order = await instance.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay order creation failed:', error);
    throw new Error('Could not create Razorpay order.');
  }
}

    