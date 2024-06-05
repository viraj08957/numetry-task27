import nodemailer from "nodemailer"
import Mailgen from "mailgen"
import * as dotenv from "dotenv"

dotenv.config()

let nodeConfig = {
  host: "aol.com",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS,
  },
}
const transporter = nodemailer.createTransport(nodeConfig)

let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
})

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body

  // body of the email
  var email = {
    body: {
      name: username,
      intro: text || "Welcome to _BR ! We're excited to have you on board.",
      outro:
        "Need help, or have question ? Just replay to this email ,  we'd love to help",
    },
  }
  var emailBody = MailGenerator.generate(email)

  let message = {
    from: process.env.MAIL_ADDRESS,
    to: userEmail,
    subject: subject || "Sign up Successfully",
    html: emailBody,
  }

  //send mail
  transporter
    .sendMail(message)
    .then(() => {
      return res
        .status(200)
        .send({ msg: "You should receive an email from us" })
    })
    .catch((err) => res.status(500).send({ err }))
}
