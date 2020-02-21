import nodemailer from 'nodemailer'

const {
  SMTP_HOST = 'localhost',
  SMTP_PORT = '587',
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASSWORD,
} = process.env

export const transport = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: !!SMTP_SECURE,
  auth:
    (SMTP_USER &&
      SMTP_PASSWORD && {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      }) ||
    undefined,
})

export const sendMail = (
  to: string | string[],
  subject: string,
  content: string,
  from = '"CineVO 🍿" <contact@heavycookie.co>'
) =>
  transport.sendMail({
    from,
    to: to instanceof Array ? to.join() : to,
    subject,
    html: content,
  })
