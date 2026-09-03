const nodemailer = require('nodemailer');

/**
 * Free Email utility using Nodemailer (Gmail SMTP or standard SMTP)
 * Automatically skips if SMTP credentials are not set in .env
 */
const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
};

const sendOrderConfirmationEmail = async (order, user) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      console.log('[Email Service] SMTP_USER yoki SMTP_PASS sozlanmagan. Email yuborish o\'tkazib yuborildi.');
      return { success: false, reason: 'Credentials not configured' };
    }

    const orderId = order._id ? order._id.toString().slice(-6).toUpperCase() : 'N/A';
    const total = Number(order.total || 0).toFixed(2);
    const toEmail = user?.email || order.user_id?.email;

    if (!toEmail) return { success: false, reason: 'No recipient email' };

    const mailOptions = {
      from: `"MiniShop Store" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `Buyurtmangiz qabul qilindi — #${orderId} | MiniShop`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #0071e3;">Xaridingiz uchun tashakkur! 🛍️</h2>
          <p>Hurmatli <strong>${user?.name || 'Mijoz'}</strong>, sizning #${orderId} raqamli buyurtmangiz muvaffaqiyatli qabul qilindi.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Jami to'lov:</strong> $${total}</p>
          <p><strong>Buyurtma holati:</strong> ${order.status || 'Qabul qilindi'}</p>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">Savollaringiz bo'lsa, qo'llab-quvvatlash xizmati bilan bog'laning.<br />MiniShop Jamoasi.</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('[Email Service] Xat yuborildi:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email Service Error]:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail
};
