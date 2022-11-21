const { SENDGRID_API_KEY } = require('./config')
const DEFAULT_SENDER = 'commandprojectmanagement@gmail.com'

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY)
const issueAssignEmail = (recipient, requesterName) => ({
  to: recipient,
  from: DEFAULT_SENDER,
  subject: `${requesterName} assigned you a new Issue`,
  html: `<p><strong>${requesterName}</strong> has assigned you a new issue. 
      
      You can log in <a href="https://scrum-management-frontend.onrender.com/">here</a> to view it under your team's project.
      </p>`,
})
const colleagueRequestEmail = (recipient, requesterName) => ({
  to: recipient,
  from: DEFAULT_SENDER,
  subject: 'Colleague Request on Command Project Management',
  html: `<p>
    <strong>${requesterName}</strong> has requested you as a colleague on Command Project Mangement.
        
    You can log in <a href="https://scrum-management-frontend.onrender.com/">here</a> to accept or remove their request.
  </p>`,
})
const colleagueConfirmedEmail = (recipient, requesterName) => ({
  to: recipient,
  from: DEFAULT_SENDER,
  subject: 'Colleague Confirmed on Command Project Management',
  html: `<p>
    <strong>${requesterName}</strong> has confirmed you as a colleague on Command Project Mangement.
    
        You can log in <a href="https://scrum-management-frontend.onrender.com/">here</a> to see them under colleagues.
  </p>`,
})

module.exports = {
  sgMail,
  colleagueRequestEmail,
  issueAssignEmail,
  colleagueConfirmedEmail,
}
