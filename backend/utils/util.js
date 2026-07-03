const generateOtp=()=>{
    return Math.floor(100000+Math.random()*900000).toString();
}
const getOtpHtml = (otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                padding: 40px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                margin-top: 40px;
                margin-bottom: 40px;
            }
            .header {
                text-align: center;
                border-bottom: 1px solid #eeeeee;
                padding-bottom: 20px;
                margin-bottom: 20px;
            }
            .header h2 {
                color: #333333;
                margin: 0;
            }
            .content {
                text-align: center;
                color: #555555;
                line-height: 1.6;
            }
            .otp-box {
                background-color: #f0f7ff;
                border: 2px dashed #0066cc;
                color: #0066cc;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 5px;
                padding: 15px;
                margin: 30px auto;
                max-width: 250px;
                border-radius: 8px;
            }
            .footer {
                text-align: center;
                font-size: 12px;
                color: #999999;
                margin-top: 30px;
                border-top: 1px solid #eeeeee;
                padding-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h2>Security Verification</h2>
            </div>
            
            <div class="content">
                <p>Hello,</p>
                <p>We received a request to verify your identity. Please use the following One-Time Password (OTP) to proceed:</p>
                
                <div class="otp-box">${otp}</div>
                
                <p><strong>Note:</strong> This code is valid for the next 10 minutes. Please do not share this code with anyone.</p>
                <p>If you did not request this verification, please ignore this email or contact support if you have concerns.</p>
            </div>
            
            <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
}
module.exports={generateOtp,getOtpHtml}