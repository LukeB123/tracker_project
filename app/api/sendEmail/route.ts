import { NextResponse } from "next/server";

import nodemailer from "nodemailer";

export interface EmailRequest {
  to: string;
  cc?: string;
  subject: string;
  text: string;
  icalEvent?: {
    method?: string;
    filename?: string;
    content: string;
  };
}

export async function POST(req: Request) {
  try {
    const emailRequest: EmailRequest = await req.json();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER as string,
      ...emailRequest,
    });
    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending email" },
      { status: 500 }
    );
  }
}
