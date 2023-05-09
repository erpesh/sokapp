import transporter from '../../lib/nodemailer.config';
import {NextApiRequest, NextApiResponse} from "next";

async function sendEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_EMAIL_USERNAME,
    to,
    subject,
    html
  };
  await transporter.sendMail(mailOptions);
}

async function bookLesson(
  userEmail: string,
  teacherEmail: string,
  emailSubject: string,
  userBookingHtml: string,
  teacherBookingHtml: string,
) {
  try {
    await sendEmail(userEmail,  emailSubject, userBookingHtml);
    await sendEmail(teacherEmail, emailSubject, teacherBookingHtml);
    return "success";
  }
  catch (e) {
    return e;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const body = JSON.parse(req.body);
    try {
      const email = body.email;
      const teacherEmail = body.teacherEmail;
      const emailSubject = body.emailSubject;
      const userBookingHtml = body.userBookingHtml;
      const teacherBookingHtml = body.teacherBookingHtml;

      const response = await bookLesson(
        email,
        teacherEmail,
        emailSubject,
        userBookingHtml,
        teacherBookingHtml
      );
      res.status(200).json(response);
    } catch (e) {
      res.status(500).json(e);
    }
  } else res.status(200).json("private");
}