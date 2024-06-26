const nodemailer = require("nodemailer");
//constructing for informing supervisor for ot form submitted
module.exports = async (formData, receiverEmail, subject, url) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      port: 465,
      secure: true,
      logger: true,
      debug: true,
      secureConnection: false,
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
    <div style="border: 2px solid orange; padding: 10px; font-size: 16px; text-align: center;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.5);">
  <p style="font-size: 16px; font-weight: bold;">You have been requested to review the following:</p>
  <p style="text-align: justify;">
    <strong>Name:</strong> ${formData.name}<br>
    <strong>Email:</strong> ${formData.email}<br>
    <strong>Shift:</strong> ${formData.shift}<br>
    <strong>Location:</strong> ${formData.location}<br>
    <strong>Date:</strong> ${formData.date}<br>
    <strong>Time To:</strong> ${formData.timeto}<br>
    <strong>Time From:</strong> ${formData.timefrom}<br>
    <strong>Duration:</strong> ${formData.duration}<br>
    <strong>Requested By:</strong> ${formData.by}<br>
    <strong>Department:</strong> ${formData.department}<br>
    <strong>Reason:</strong> ${formData.reason}<br>
    <strong>Timestamp:</strong> ${formData.timestamp}<br>
  </p>
  <p>
    <a href="${url}" style="background-color: #FF6C37; /* Green */
      border: none;
      color: white;
      padding: 13px 28px;
      border-radius: 5px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;">Go to my account</a>
  </p>
</div>

  `,
    };
    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Email sent Successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};
