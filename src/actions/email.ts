'use server'

/**
 * Email Service using Resend (Free Tier)
 * Handles all email notifications
 * 
 * Setup: Add RESEND_API_KEY to your .env.local
 * Get free API key from: https://resend.com
 */

/**
 * Sends registration confirmation email with admit card details
 */
export async function sendRegistrationEmail({
  email,
  name,
  rollNumber,
  centerName,
}: {
  email: string
  name: string
  rollNumber: string
  centerName: string
}): Promise<{ success: boolean }> {
  try {
    // Check if Resend API key is configured
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
      return { success: false }
    }

    // Send email using Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Exam Portal <onboarding@resend.dev>', // Use your verified domain
        to: [email],
        subject: 'Registration Successful - Exam Center Allotment',
        html: generateRegistrationEmailHTML(name, rollNumber, centerName),
      }),
    })

    if (!response.ok) {
      console.error('Email sending failed:', await response.text())
      return { success: false }
    }

    console.log('Registration email sent successfully to:', email)
    return { success: true }
  } catch (error) {
    console.error('Error sending registration email:', error)
    return { success: false }
  }
}

/**
 * Sends admit card notification email
 */
export async function sendAdmitCardEmail({
  email,
  name,
  rollNumber,
  centerName,
}: {
  email: string
  name: string
  rollNumber: string
  centerName: string
}): Promise<{ success: boolean }> {
  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
      return { success: false }
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Exam Portal <onboarding@resend.dev>',
        to: [email],
        subject: 'Your Admit Card is Ready - Download Now',
        html: generateAdmitCardEmailHTML(name, rollNumber, centerName),
      }),
    })

    if (!response.ok) {
      console.error('Email sending failed:', await response.text())
      return { success: false }
    }

    console.log('Admit card email sent successfully to:', email)
    return { success: true }
  } catch (error) {
    console.error('Error sending admit card email:', error)
    return { success: false }
  }
}

/**
 * Generate HTML template for registration email
 */
function generateRegistrationEmailHTML(
  name: string,
  rollNumber: string,
  centerName: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #4F46E5; border-radius: 4px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    .highlight { color: #4F46E5; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Registration Successful!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Congratulations! Your registration for the examination has been successfully completed.</p>
      
      <div class="info-box">
        <h3>Your Registration Details:</h3>
        <p><strong>Roll Number:</strong> <span class="highlight">${rollNumber}</span></p>
        <p><strong>Allotted Center:</strong> ${centerName}</p>
        <p><strong>Exam Date:</strong> 15th February 2026</p>
        <p><strong>Exam Time:</strong> 10:00 AM - 1:00 PM</p>
      </div>

      <p><strong>Important Instructions:</strong></p>
      <ul>
        <li>Keep your Roll Number safe - you'll need it to download your admit card</li>
        <li>Admit card will be available for download from 1st February 2026</li>
        <li>Bring a printed copy of your admit card to the exam center</li>
        <li>Carry a valid ID proof (Aadhaar/Voter ID/Passport)</li>
        <li>Report to the exam center 30 minutes before the exam time</li>
      </ul>

      <p>Best wishes for your examination!</p>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply.</p>
      <p>© 2026 Examination Portal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}

/**
 * Generate HTML template for admit card email
 */
function generateAdmitCardEmailHTML(
  name: string,
  rollNumber: string,
  centerName: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .cta-button { background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
    .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #059669; border-radius: 4px; }
    .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Admit Card is Ready!</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${name}</strong>,</p>
      <p>Your admit card for the upcoming examination is now available for download.</p>
      
      <div class="info-box">
        <p><strong>Roll Number:</strong> ${rollNumber}</p>
        <p><strong>Exam Center:</strong> ${centerName}</p>
        <p><strong>Exam Date:</strong> 15th February 2026</p>
        <p><strong>Reporting Time:</strong> 9:30 AM</p>
      </div>

      <p><strong>Important Reminders:</strong></p>
      <ul>
        <li>Download and print your admit card</li>
        <li>Bring the printed admit card to the exam center</li>
        <li>Carry a valid photo ID proof</li>
        <li>Reach the center 30 minutes before exam time</li>
      </ul>
    </div>
    <div class="footer">
      <p>This is an automated email. Please do not reply.</p>
      <p>© 2026 Examination Portal. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}
