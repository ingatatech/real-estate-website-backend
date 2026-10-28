import nodemailer from 'nodemailer';

interface MailConfig {
  frontendUrl: string;
  from: string;
  transporter: nodemailer.Transporter;
}

const getMailConfig = (): MailConfig | null => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const portStr = process.env.SMTP_PORT || process.env.EMAIL_PORT;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASSWORD || process.env.EMAIL_PASS;
  const from = process.env.SMTP_FROM || process.env.EMAIL_FROM || user;
  const frontendUrl = process.env.FRONTEND_URL || process.env.CLIENT_URL || 'https://ingata-real-estate.vercel.app';

  if (!host || !portStr || !user || !pass || !from) return null;

  const port = Number(portStr);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return null;
  }

  return {
    frontendUrl: frontendUrl.replace(/\/+$/, ''),
    from,
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === 'true' || port === 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    }),
  };
};

export const isVerificationEmailConfigured = () => getMailConfig() !== null;

export const sendVerificationEmail = async (email: string, token: string): Promise<boolean> => {
  const config = getMailConfig();
  if (!config) {
    console.warn('[EmailVerification] SMTP not configured. Skipping email to:', email);
    return false;
  }

  const verifyUrl = new URL('/portal/verify-email', `${config.frontendUrl}/`);
  verifyUrl.searchParams.set('token', token);

  try {
    await config.transporter.sendMail({
      from: config.from,
      to: email,
      subject: 'Verify your Ingata account email address',
      text: `Welcome to Ingata Real Estate!\n\nPlease verify your email address by visiting the following link within 24 hours:\n\n${verifyUrl.toString()}\n\nIf you did not create an account, you can ignore this message.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <h2 style="color: #0f172a; margin-top: 0;">Welcome to Ingata Real Estate</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.5;">
            Thank you for registering. Please click the button below to verify your email address. This verification link expires in 24 hours.
          </p>
          <div style="margin: 24px 0;">
            <a href="${verifyUrl.toString()}" style="background-color: #059669; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #64748b; font-size: 13px;">
            Or copy and paste this link into your browser:<br />
            <a href="${verifyUrl.toString()}" style="color: #059669; word-break: break-all;">${verifyUrl.toString()}</a>
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">
            If you did not create an account with Ingata Real Estate, please disregard this email.
          </p>
        </div>
      `,
    });
    return true;
  } catch (error) {
    console.error('[EmailVerification] Failed to send verification email:', error);
    return false;
  }
};
