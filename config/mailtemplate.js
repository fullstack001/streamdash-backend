import dotenv from "dotenv";
dotenv.config();

const style = `<style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f3f4f6;
                    margin: 0;
                    padding: 0;
                }

                .email-container {
                    background-color: #fefefe;
                    margin: 20px auto;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    max-width: 600px;
                }

                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    font-size: 16px;
                    cursor: pointer;
                    text-align: center;
                    text-decoration: none;
                    outline: none;
                    color: #fefefe;
                    background-color: #007bff;
                    border: none;
                    border-radius: 5px;
                    box-shadow: 0 4px #999;
                }

                .button:hover {background-color: #0069d9}

                .button:active {
                    background-color: #0069d9;
                    box-shadow: 0 2px #666;
                    transform: translateY(2px);
                }

                p {
                    font-size: 16px;
                    color: #333;
                }
            </style>`;

export function resetPasswordLink(token) {
  const resetLink = `${process.env.CLIENT}reset-password/${token}`;
  return `<!DOCTYPE html>
            <html>
            <head>
                ${style}
            </head>
            <body>
                <div class="email-container">
                    <p>Dear valued client,</p>
                    <p>Click the below button to Reset Password :</p>
                    <a href="${resetLink}" class="button">Reset Password</a>
                    <p>hello</p>
                    <p>Please do not reply to this automated message.</p>
                    <p>Best wishes,<br>
                    Streamdash Support Team</p>
                </div>
            </body>
            </html>`;
}

export function validationCodeContent(userName, code) {
  return `<!DOCTYPE html>
            <html>
            <head>
                ${style}
            </head>
            <body>
                <div class="email-container">
                    <p>Dear ${userName},</p>
                    <p>Your verification code is :</p>
                    <div class="button">${code}</div>
                    <p>Use this code to verify your account.</p>
                    <p>Please do not reply to this automated message.</p>
                    <p>Best wishes,<br>
                    Streamdash Support Team</p>
                </div>
            </body>
            </html>`;
}
