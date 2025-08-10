import { Telegraf, Markup } from 'telegraf';
import dotenv from 'dotenv';

// .env fayldan TOKEN va ADMIN_CHAT_ID ni olish
dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Start komandasi
bot.start((ctx) => {
  ctx.reply(
    "👋 Assalomu alaykum! IELTS Botga xush kelibsiz.\n\n" +
    "Quyidagi tugmalardan birini tanlang:",
    Markup.inlineKeyboard([
      [Markup.button.callback("📋 Test boshlash", "start_test")],
      [Markup.button.callback("✍️ Fikr bildirish", "send_feedback")]
    ])
  );
});

// Test boshlash
bot.action("start_test", (ctx) => {
  ctx.reply("📋 Test boshlanishi kerak, ammo bu qism hali tayyor emas 😅");
});

// Fikr bildirish
bot.action('send_feedback', async (ctx) => {
  await ctx.reply("✍️ Fikr va mulohazalaringizni yozing:");

  const handleText = async (msgCtx) => {
    const feedback = msgCtx.message.text;

    await ctx.telegram.sendMessage(
      process.env.ADMIN_CHAT_ID,
      `📩 Yangi fikr:\n${feedback}`
    );

    await msgCtx.reply("✅ Fikringiz uchun rahmat!");

    // Listenerni o'chirish
    bot.off('text', handleText);
  };

  bot.on('text', handleText);
});

// Xatolarni ushlash
bot.catch((err, ctx) => {
  console.error(`❌ Xatolik: ${ctx.updateType}`, err);
});

// Botni ishga tushirish
bot.launch();

// Graceful stop (Render uchun muhim)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
