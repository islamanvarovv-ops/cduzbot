require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);

let users = new Set(); // foydalanuvchilarni saqlash
const TOTAL_TESTS = 30; // har bo'lim uchun test soni

// Start komandasi
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

// Listening testlari
bot.action('choose_listening', (ctx) => {
  const buttons = [];
  for (let i = 1; i <= TOTAL_TESTS; i++) {
    buttons.push([Markup.button.url(`Test ${i}`, `https://example.com/listening/${i}`)]);
  }
  ctx.reply('🎧 Listening testlari:', Markup.inlineKeyboard(buttons));
});

// Reading testlari
bot.action('choose_reading', (ctx) => {
  const buttons = [];
  for (let i = 1; i <= TOTAL_TESTS; i++) {
    buttons.push([Markup.button.url(`Test ${i}`, `https://example.com/reading/${i}`)]);
  }
  ctx.reply('📖 Reading testlari:', Markup.inlineKeyboard(buttons));
});

// Statistika
bot.action('show_stats', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply(
    `📊 Statistika:\n` +
    `Listening testlari: ${TOTAL_TESTS} ta\n` +
    `Reading testlari: ${TOTAL_TESTS} ta\n` +
    `Foydalanuvchilar soni: ${users.size} ta`
  );
});

// Feedback
bot.action('send_feedback', (ctx) => {
  ctx.answerCbQuery();
  ctx.reply('✍️ Savolingiz yoki fikringizni yozing:');
  bot.once('text', (msgCtx) => {
    const feedback = msgCtx.message.text;
    msgCtx.reply('✅ Fikringiz qabul qilindi. Rahmat!');
    bot.telegram.sendMessage(process.env.ADMIN_ID, `📩 Feedback ${msgCtx.from.first_name}dan:\n${feedback}`);
  });
});

bot.launch();
console.log('🤖 Bot ishga tushdi...');
