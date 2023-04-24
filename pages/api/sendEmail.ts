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
  studentName: string,
  userEmail: string,
  teacherName: string,
  teacherEmail: string,
  lessonDate: string,
  lessonTime: string
) {

  const userBookingConfirmationHtml = `
  <p>Thank you for booking a lesson with ${teacherName} on ${lessonDate} at ${lessonTime}. Your booking has been confirmed and we look forward to seeing you at the lesson.</p>
  <p>If you have any questions or need to reschedule, please let us know as soon as possible.</p>
  <p>Best regards</p>
`;

  const teacherBookingHtml = `
  <p>${studentName} booked a lesson with you on ${lessonDate} at ${lessonTime}.</p>
  <p>Best regards</p>
`;

  try {
    await sendEmail(userEmail, "Lesson booking", userBookingConfirmationHtml);
    await sendEmail(teacherEmail, "Lesson booking", teacherBookingHtml);
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
      const studentName = body.studentName;
      const email = body.email;
      const teacherName = body.teacherName;
      const teacherEmail = body.teacherEmail;
      const lessonDate = body.lessonDate;
      const lessonTime = body.lessonTime;

      const response = await bookLesson(studentName, email, teacherName, teacherEmail, lessonDate, lessonTime);
      res.status(200).json(response);
    } catch (e) {
      res.status(500).json(e);
    }
  } else res.status(200).json("private");
}