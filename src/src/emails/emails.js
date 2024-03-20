const fs = require("fs");
const path = require("path");
const transporter = require("./config");

const sendRecoveryCode = async (to, code) => {
  try {
    const htmlFilePath = path.resolve("./src/emails/templates/recovery1.html");
    const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
    const personalizedHtmlContent = htmlContent.replace("{{code}}", code);
    const response = await transporter.sendMail({
      
      to,
      subject: "Se ha enviado el codigo de verificacion para recuperar la contraseña",
      html: personalizedHtmlContent,
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { sendRecoveryCode };