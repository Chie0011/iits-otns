const nodemailer = require("nodemailer");
//constructing reset link UI in email

module.exports = async (receiverEmail, subject, url) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      // logger: true,
      // debug: true,
      // secureConnection: false,
      auth: {
        user: "noreplyotnotificationsystem@gmail.com",
        pass: "gedmnqjmwctohbmq",
      },
      tls: {
        rejectUnAuthorized: true,
      },
    });

    // Define email content
    let mailOptions = {
      from: "noreplyotnotificationsystem@gmail.com",
      to: receiverEmail,
      subject: subject,
      html: `
    
    <div style="border: 2px solid #0000FF; /* Green border */
    border-radius: 5px;
    padding: 20px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);">
<p style="text-align: center; font-weight: bold;">Hi</p>
<p style="text-align: center; font-weight: bold;">We have received your request to reset your password. Please click the link below to complete the reset.
</p>

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
                     Reset My Password
                     </a>
</p>
</div>

  `, // Include the URL in the email content
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
