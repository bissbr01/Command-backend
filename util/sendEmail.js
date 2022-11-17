const { SENDGRID_API_KEY } = require('./config')
const DEFAULT_SENDER = 'commandprojectmanagement@gmail.com'

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY)
const colleagueRequestEmail = (recipient, requesterName) => ({
  to: recipient,
  from: DEFAULT_SENDER,
  subject: 'Colleague Request on Command Project Management',
  text: `${requesterName} has requested you as a colleague on Command Project Mangement.  
      
      You can log in at https://scrum-management-frontend.onrender.com/ to accept or remove their request.
      `,
})

module.exports = { sgMail, colleagueRequestEmail }
