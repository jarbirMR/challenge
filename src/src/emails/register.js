const fs = require("fs");
const path = require("path");
const transporter = require("./config");

const sendEmailCode = async (name, surname, email) => {
  try {
    const htmlFilePath = path.resolve("./src/emails/templates/recovery.html");
    const htmlContent = fs.readFileSync(htmlFilePath, "utf-8");
   const personalizedHtmlContent = htmlContent.replace("{{name}}",
   name).replace("{{surname}}",
   surname).replace("{{email}}",
   email);
   
    const response = await transporter.sendMail({
      to: `jarbir.s.m.r.98@gmail.com`,
      subject: "Se ha registrado un nuevo usuario en el proyecto semilla",
      html: personalizedHtmlContent,
      //yorluis.vega@gmail.com
    });
    return response;
  } catch (error) {
    console.error(error);
    return null;
  }
};

module.exports = { sendEmailCode };