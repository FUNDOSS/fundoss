import mailgun from 'mailgun-js';
import { formatAmountForDisplay } from '../utils/currency';

type Email = {
  to:string;
  subject:string;
  text?:string;
  html?:string;
}

const Mail = {
  init: () => {
    if (!Mail.api) {
      Mail.api = mailgun({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
      });
    }
    return Mail.api;
  },
  send: (email:Email) => {
    const mail = Mail.init().messages()
      .send({ ...email, ...{ from: 'FundOSS <info@fundoss.org>' } })
      .catch((err) => console.log(err));
    return mail;
  },
  paymentConfirmation: (payment) => {
    Mail.send({
      to: payment.user.email,
      subject: 'Thank you for your donation on FundOSS',
      html: Mail.layout(`
        <h1>Thank you ${payment.user.name}</h1>
        <p>This is your receipt for your donations on FundOSS</p>
        <b>Total : ${formatAmountForDisplay(payment.amount)}</b>
        <p>You supported the following collectives :</p>
        ${payment.donations.map((item) => `${formatAmountForDisplay(item.amount)} ${item.collective.name}`).join('<br />')}
        <p>Want to share your cart? Copy/paste the link below</p>
        <p>${process.env.HOSTING_URL}/share/${payment.sid}</p>
      `),
    });
  },
  layout: (content) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Your Message Subject or Title</title>
      <style type="text/css">
        #outlook a {padding:0;} /* Force Outlook to provide a "view in browser" menu link. */
        body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}
        .ExternalClass {width:100%;} /* Force Hotmail to display emails at full width */
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
        #backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}
        img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
        a img {border:none;}
        .image_fix {display:block;}
        Bring inline: Yes. */
        p {margin: 1em 0;}
        Bring inline: Yes. */
        h1, h2, h3, h4, h5, h6 {color: black !important;}
        h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: blue !important;}
        table td {border-collapse: collapse;}
        table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }
        a {color: #6B37FF;}
        @media only screen and (max-device-width: 480px) {
          a[href^="tel"], a[href^="sms"] {
                text-decoration: none;
                color: blue; /* or whatever your want */
                pointer-events: none;
                cursor: default;
              }

          .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
                text-decoration: default;
                color: orange !important;
                pointer-events: auto;
                cursor: default;
              }

        }

      <!--[if gte mso 9]>
        <style>
        /* Target Outlook 2007 and 2010 */
        </style>
      <![endif]-->
    </head>
    <body>
    <table cellpadding="0" cellspacing="0" border="0" id="backgroundTable">
      <tr>
        <td valign="top">
        <table cellpadding="0" cellspacing="0" border="0" align="center">
          <tr>
            <td width="600" valign="top">${content}</td>
          </tr>
        </table>
        <a href="${process.env.HOSTING_URL}" target ="_blank" title="Styling Links" style="color: #6B37FF; text-decoration: none;">FundOss.org</a>
        <br><img class="image_fix" src="${process.env.HOSTING_URL}/static/logo.png" alt="FundOss" title="FundOss" width="300" height="45" />
        </td>
      </tr>
    </table>
    </body>
    </html>`,
  api: null,
};

export default Mail;
