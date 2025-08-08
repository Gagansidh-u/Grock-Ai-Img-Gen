
// src/components/invoice.tsx
import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './ui/card';
import { Separator } from './ui/separator';

export interface InvoiceData {
  planName: string;
  amount: number;
  orderId: string;
  paymentId: string;
  userName: string;
  userEmail: string;
  date: Date;
}

export function Invoice(props: InvoiceData) {
  return (
    <Card className="border-none shadow-none bg-transparent">
        <CardHeader className="p-0">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Image src="https://raw.githubusercontent.com/Gagansidh-u/Images/main/logo2.png" alt="Logo" width={33} height={33} />
                        <h1 className="text-2xl font-bold">TryQuad AI</h1>
                    </div>
                    <CardDescription>Invoice for your purchase</CardDescription>
                </div>
                <div className="text-right">
                    <CardTitle className="text-3xl font-extrabold text-primary mb-1">INVOICE</CardTitle>
                    <p className="text-xs text-muted-foreground"># {props.paymentId}</p>
                </div>
            </div>
        </CardHeader>
        <CardContent className="p-0 mt-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-2">Billed To:</h3>
                    <p className="text-sm">{props.userName}</p>
                    <p className="text-sm text-muted-foreground">{props.userEmail}</p>
                </div>
                <div className="text-right">
                    <h3 className="font-semibold mb-1">Payment Date</h3>
                    <p className="text-sm">{props.date.toLocaleDateString()}</p>
                     <h3 className="font-semibold mb-1 mt-2">Order ID</h3>
                    <p className="text-sm">{props.orderId}</p>
                </div>
            </div>
            <Separator className="my-6" />
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border">
                        <th className="text-left font-semibold pb-2">Description</th>
                        <th className="text-right font-semibold pb-2">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="pt-2">{props.planName} Plan Subscription</td>
                        <td className="text-right pt-2">₹{props.amount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <Separator className="my-6" />
            <div className="flex justify-end">
                <div className="text-right">
                    <p className="text-muted-foreground">Subtotal</p>
                    <p className="text-xl font-bold">₹{props.amount.toFixed(2)}</p>
                </div>
            </div>
        </CardContent>
        <CardFooter className="p-0 mt-8 text-center text-xs text-muted-foreground">
            Thank you for your purchase! If you have any questions, please contact support@tryquad.ai.
        </CardFooter>
    </Card>
  );
}

    
