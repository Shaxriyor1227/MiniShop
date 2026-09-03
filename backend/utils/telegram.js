/**
 * Telegram Bot Notification Utility for MiniShop
 * Automatically notifies admins when a new order is placed.
 * Safe fallback: If TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing, it skips silently.
 */
const sendOrderTelegramNotification = async (order) => {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('[Telegram Notification] TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan. Xabarnoma yuborilmadi.');
    return { success: false, reason: 'Credentials missing' };
  }

  try {
    const orderId = order._id ? order._id.toString().slice(-6).toUpperCase() : 'NOMA\'LUM';
    const customerName = order.user_id?.name || 'Mijoz';
    const customerEmail = order.user_id?.email || '-';
    const customerPhone = order.user_id?.phone_number || order.address_id?.phone || 'Kiritilmagan';
    const address = order.address_id
      ? `${order.address_id.city || ''}, ${order.address_id.street || ''} (Pochta: ${order.address_id.postal_code || '-'})`
      : 'Yetkazib berish manzili';

    const itemsText = (order.items || [])
      .map((item, idx) => {
        const title = item.product_id?.name || item.name || 'Mahsulot';
        return `  ${idx + 1}. <b>${title}</b> — ${item.quantity} dona × $${item.price}`;
      })
      .join('\n');

    const total = Number(order.total || 0).toFixed(2);
    const paymentMethod = order.payment_method || 'Karta / Naqd';

    const message = [
      `🛍️ <b>YANGI BUYURTMA QABUL QILINDI!</b>`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `🆔 <b>Buyurtma:</b> #${orderId}`,
      `👤 <b>Mijoz:</b> ${customerName}`,
      `📧 <b>Email:</b> ${customerEmail}`,
      `📞 <b>Telefon:</b> ${customerPhone}`,
      `📍 <b>Manzil:</b> ${address}`,
      `💳 <b>To'lov:</b> ${paymentMethod}`,
      `━━━━━━━━━━━━━━━━━━━━`,
      `📦 <b>Mahsulotlar:</b>`,
      itemsText || '  Mahsulotlar mavjud emas',
      `━━━━━━━━━━━━━━━━━━━━`,
      `💰 <b>JAMI SUMMA:</b> $${total}`,
      `🕒 <b>Vaqt:</b> ${new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' })}`
    ].join('\n');

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Using global fetch (Node.js 18+)
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('[Telegram Notification Error]:', data.description);
      return { success: false, error: data.description };
    }

    console.log(`[Telegram Notification] #${orderId} buyurtmasi Telegram botga yuborildi.`);
    return { success: true };
  } catch (error) {
    console.error('[Telegram Notification Exception]:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderTelegramNotification
};
