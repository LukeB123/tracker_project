import { EmailRequest } from "@/app/api/sendEmail/route";

export default async function sendEmail(emailData: EmailRequest) {
  try {
    const responce = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...emailData }),
    });

    const data = await responce.json();
    console.log(data);
  } catch (error) {
    console.log("Error:", error);
  }
}
