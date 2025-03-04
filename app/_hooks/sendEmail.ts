interface EmailRequest {
  to: string;
  cc?: string;
  subject: string;
  text: string;
}

export default async function sendEmail(emailData: EmailRequest) {
  console.log("sending email");
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
