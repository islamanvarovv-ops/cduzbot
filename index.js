require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

let users = new Set(); 
const TOTAL_TESTS = 30; 

// /start komandasi
bot.start((ctx) => {
  users.add(ctx.from.id);
  ctx.reply(
    `Salom, ${ctx.from.first_name}!\nIELTS Practice botiga xush kelibsiz.`,
    Markup.inlineKeyboard([
      [Markup.button.callback('🎧 Listening', 'choose_listening')],
      [Markup.button.callback('📖 Reading', 'choose_reading')],
      [Markup.button.callback('📊 Statistika', 'show_stats')],
      [Markup.button.callback('✉️ Feedback', 'send_feedback')]
    ])
  );
});

// Listening testlari (3 ustun)
bot.action('choose_listening', (ctx) => {
  ctx.deleteMessage(); // eski xabarni o‘chiradi

  const buttons = [];
  for (let i = 1; i <= TOTAL_TESTS; i++) {
    buttons.push(Markup.button.url(`Test ${i}`, `https://example.com/listening/${i}`));
  }

  const chunkedButtons = [];
  for (let i = 0; i < buttons.length; i += 3) {
    chunkedButtons.push(buttons.slice(i, i + 3));
  }

  ctx.reply('🎧 Listening testlari:', Markup.inlineKeyboard(chunkedButtons));
});

// Reading testlari (3 ustun)
bot.action('choose_reading', (ctx) => {
  ctx.deleteMessage();

  const buttons = [];
  for (let i = 1; i <= TOTAL_TESTS; i++) {
    buttons.push(Markup.button.url(`Test ${i}`, `https://example.com/reading/${i}`));
  }

  const chunkedButtons = [];
  for (let i = 0; i < buttons.length; i += 3) {
    chunkedButtons.push(buttons.slice(i, i + 3));
  }

  ctx.reply('📖 Reading testlari:', Markup.inlineKeyboard(chunkedButtons));
});

// Statistika
bot.action('show_stats', (ctx) => {
  ctx.deleteMessage();
  ctx.reply(
    `📊 Statistika:\n` +
    `Listening testlari: ${TOTAL_TESTS} ta\n` +
    `Reading testlari: ${TOTAL_TESTS} ta\n` +
    `Foydalanuvchilar soni: ${users.size} ta`
  );
});

// Feedback (dinamik ishlash uchun)
// Callback query ishlovchi
bot.action('send_feedback', async (ctx) => {
  await ctx.reply("✍️ Fikr va mulohazalaringizni yozib yuboring:");

  // Bu listener faqat bir marta ishlaydi
  const onText = async (msgCtx) => {
    // Foydalanuvchi yozgan matn
    const feedback = msgCtx.message.text;

    // Fikrni o'zingga yoki admin kanaliga yuborish
    await ctx.telegram.sendMessage(
      process.env.ADMIN_CHAT_ID,
      `📩 Yangi fikr:\n${feedback}`
    );

    await msgCtx.reply("✅ Fikringiz uchun rahmat!");

    // Listenerni o'chirish (faqat bitta javob qabul qilinadi)
    bot.off('text', onText);
  };

  // Listener qo'shish
  bot.on('text', onText);
});

bot.launch();
console.log('🤖 Bot ishga tushdi...');

