import nodemailer from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';

const user = process.env.MAIL_USER;
const pass = process.env.MAIL_PASS;
const url = process.env.FE_URL;

const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: user,
    pass: pass,
  },
});

transport.use(
  'compile',
  hbs({
    viewEngine: {
      extname: '.hbs',
      layoutsDir: 'views',
      defaultLayout: false,
    },
    viewPath: 'views',
    extName: '.hbs',
  })
);

export const sendAdminConfirmation = async (email: string, uniqueKey: string) => {
  const options = {
    from: user,
    to: email,
    subject: 'คุณได้รับคำเชิญให้เป็นผู้ดูแลระบบของ Cookify Web Application',
    template: 'admin_invitation',
    context: { link: `${url}/register?uniqueKey=${uniqueKey}` },
  };
  await transport.sendMail(options);
};

export const sendAdminRevocation = async (email: string) => {
  const options = {
    from: user,
    to: email,
    subject: 'คุณได้ถูกถอดสิทธิ์ในการเป็นผู้ดูแลระบบของ Cookify Web Application',
    template: 'revoke_admin',
    context: { link: `${url}/register` },
  };
  await transport.sendMail(options);
};
