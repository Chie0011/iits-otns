const nodemailer = require("nodemailer");
//constructing account created UI in email

module.exports = async (email, subject, url) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      service: "gmail",
      secure: true,
      auth: {
        user: "noreplyotnotificationsystem@gmail.com",
        pass: "gedmnqjmwctohbmq",
      },
      tls: {
        rejectUnAuthorized: true,
      },
    });

    // Construct the email body
    const body = `
    <div style="border: 2px solid #0000FF; /* Green border */
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);">
<p style="text-align: center; font-weight: bold;">Hi</p>
<p style="text-align: center; font-weight: bold;">Your account has been successfully created! To continue, please verify your account using the following link:</p>

<p style="text-align: center;">
<a href="${url}" style="background-color: #FF6C37; /* Green */
                     border: none;
                     color: white;
                     padding: 13px 28px;
                     border-radius: 5px;
                     text-decoration: none;
                     display: inline-block;
                     font-size: 16px;
                     margin: 4px 2px;
                     cursor: pointer;">
                     Verify Your Account
                     </a>
</p>
</div>
`;

    await transporter.sendMail({
      from: "<noreplyotnotificationsystem@gmail.com>",
      to: email,
      subject: subject,
      html: body,
    });
    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
