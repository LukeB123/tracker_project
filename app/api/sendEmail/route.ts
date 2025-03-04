import { NextResponse } from "next/server";

import nodemailer from "nodemailer";

interface EmailRequest {
  to: string;
  subject: string;
  text: string;
}

export async function POST(req: Request) {
  try {
    const { to, subject, text }: EmailRequest = await req.json();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER as string,
        pass: process.env.EMAIL_PASS as string,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER as string,
      to,
      subject,
      text,
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
