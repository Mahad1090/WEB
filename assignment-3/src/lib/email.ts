import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendNewLeadEmail(leadData: any, adminEmail: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Property CRM <noreply@propertycrm.com>',
    to: adminEmail,
    subject: `New Lead: ${leadData.name} - ${leadData.propertyInterest}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .field { margin: 10px 0; }
          .label { font-weight: bold; color: #4F46E5; }
          .priority-high { color: #EF4444; font-weight: bold; }
          .priority-medium { color: #F59E0B; font-weight: bold; }
          .priority-low { color: #10B981; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏠 New Lead Alert</h1>
          </div>
          <div class="content">
            <h2>A new lead has been created!</h2>
            <div class="field">
              <span class="label">Name:</span> ${leadData.name}
            </div>
            <div class="field">
              <span class="label">Email:</span> ${leadData.email}
            </div>
            <div class="field">
              <span class="label">Phone:</span> ${leadData.phone}
            </div>
            <div class="field">
              <span class="label">Property Interest:</span> ${leadData.propertyInterest}
            </div>
            <div class="field">
              <span class="label">Budget:</span> PKR ${leadData.budget.toLocaleString()}
            </div>
            <div class="field">
              <span class="label">Priority:</span> 
              <span class="priority-${leadData.priority}">${leadData.priority.toUpperCase()}</span>
            </div>
            ${leadData.notes ? `
            <div class="field">
              <span class="label">Notes:</span> ${leadData.notes}
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>This is an automated email from Property Dealer CRM System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('New lead email sent successfully');
  } catch (error) {
    console.error('Error sending new lead email:', error);
  }
}

export async function sendLeadAssignmentEmail(leadData: any, agentEmail: string, agentName: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'Property CRM <noreply@propertycrm.com>',
    to: agentEmail,
    subject: `New Lead Assigned: ${leadData.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
          .content { background: #f9fafb; padding: 20px; border-radius: 8px; margin-top: 20px; }
          .field { margin: 10px 0; }
          .label { font-weight: bold; color: #4F46E5; }
          .priority-high { color: #EF4444; font-weight: bold; }
          .priority-medium { color: #F59E0B; font-weight: bold; }
          .priority-low { color: #10B981; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 New Lead Assignment</h1>
          </div>
          <div class="content">
            <h2>Hello ${agentName},</h2>
            <p>A new lead has been assigned to you. Please follow up as soon as possible.</p>
            <div class="field">
              <span class="label">Name:</span> ${leadData.name}
            </div>
            <div class="field">
              <span class="label">Email:</span> ${leadData.email}
            </div>
            <div class="field">
              <span class="label">Phone:</span> ${leadData.phone}
            </div>
            <div class="field">
              <span class="label">Property Interest:</span> ${leadData.propertyInterest}
            </div>
            <div class="field">
              <span class="label">Budget:</span> PKR ${leadData.budget.toLocaleString()}
            </div>
            <div class="field">
              <span class="label">Priority:</span> 
              <span class="priority-${leadData.priority}">${leadData.priority.toUpperCase()}</span>
            </div>
            ${leadData.notes ? `
            <div class="field">
              <span class="label">Notes:</span> ${leadData.notes}
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>This is an automated email from Property Dealer CRM System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Lead assignment email sent successfully');
  } catch (error) {
    console.error('Error sending lead assignment email:', error);
  }
}
