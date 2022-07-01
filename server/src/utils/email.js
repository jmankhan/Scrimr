import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = (to, subject, html) => {
  return transport.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};
