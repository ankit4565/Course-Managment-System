const https = require("https");

// Send email using Brevo API
const sendEmail = async (to, subject, htmlContent) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      sender: {
        name: process.env.BREVO_FROM_NAME,
        email: process.env.BREVO_FROM_EMAIL,
      },
      to: [
        {
          email: to,
        },
      ],
      subject: subject,
      htmlContent: htmlContent,
    });

    const options = {
      hostname: "api.brevo.com",
      port: 443,
      path: "/v3/smtp/email",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": data.length,
        "api-key": process.env.BREVO_API_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(responseData));
        } else {
          reject(new Error(`Brevo API Error: ${res.statusCode} - ${responseData}`));
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

// Email templates
const registrationOtpEmail = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; padding: 24px; }
          .header { background-color: #0f172a; color: white; padding: 24px; text-align: center; border-radius: 16px 16px 0 0; }
          .content { background-color: #ffffff; padding: 24px; border: 1px solid #e2e8f0; }
          .otp { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; background: #eff6ff; padding: 18px; border-radius: 12px; color: #1d4ed8; margin: 24px 0; }
          .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verify Your Email</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Use the OTP below to complete your registration. It expires in a few minutes.</p>
            <div class="otp">${otp}</div>
            <p>If you didn't request this, you can ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Course Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const forgotPasswordOtpEmail = (otp) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; padding: 24px; }
          .header { background-color: #0f172a; color: white; padding: 24px; text-align: center; border-radius: 16px 16px 0 0; }
          .content { background-color: #ffffff; padding: 24px; border: 1px solid #e2e8f0; }
          .otp { font-size: 32px; font-weight: bold; letter-spacing: 8px; text-align: center; background: #ecfeff; padding: 18px; border-radius: 12px; color: #0f766e; margin: 24px 0; }
          .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 18px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset OTP</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>Use the OTP below to verify your password reset request.</p>
            <div class="otp">${otp}</div>
            <p>If you didn't request this, you can ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Course Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const passwordResetSuccessEmail = () => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #000; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f5f5f5; padding: 20px; margin: 20px 0; }
          .success { color: #28a745; }
          .footer { text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Successful</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p class="success">✓ Your password has been successfully reset!</p>
            <p>You can now log in with your new password.</p>
            <p>If you didn't perform this action, please contact support immediately.</p>
          </div>
          <div class="footer">
            <p>&copy; 2026 Course Management System. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

module.exports = {
  sendEmail,
  registrationOtpEmail,
  forgotPasswordOtpEmail,
  passwordResetSuccessEmail,
};
