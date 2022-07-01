import email from '@sendgrid/mail';
email.setApiKey(process.env.SENDGRID_KEY);

export const sendEmail = ({ to, subject, html, text }) => {
  return email.send({
    from: process.env.EMAIL_FROM,
    to,
    text,
    subject,
    html,
  });
};
