import { Telegraf, Context } from 'telegraf';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export interface BotContext extends Context {
  session?: any;
}

const bot = new Telegraf<BotContext>(process.env.TELEGRAM_BOT_TOKEN || '');

// Store conversation history per user
const conversationHistory: Map<number, Array<{ role: string; content: string }>> = new Map();

// Product configuration
const PRODUCT_PRICE = parseFloat(process.env.PRODUCT_PRICE || '100');
const DIGITAL_PRODUCT_URL = process.env.DIGITAL_PRODUCT_URL || '';

// AI Response Handler
async function getAIResponse(userId: number, message: string): Promise<string> {
  try {
    let history = conversationHistory.get(userId) || [];

    // Add system message if new conversation
    if (history.length === 0) {
      history.push({
        role: 'system',
        content: `أنت مساعد ذكي لخدمة العملاء عبر تليجرام. مهمتك:
1. الرد على استفسارات العملاء بطريقة احترافية ومهذبة
2. تقديم معلومات عن المنتجات الرقمية
3. مساعدة العملاء في عملية الشراء
4. الإجابة على الأسئلة المتعلقة بالدفع والتوصيل
5. السعر المطلوب هو ${PRODUCT_PRICE} وحدة نقدية

كن ودودًا ومحترفًا في جميع تعاملاتك.`
      });
    }

    // Add user message
    history.push({ role: 'user', content: message });

    // Keep only last 10 messages to avoid token limits
    if (history.length > 11) {
      history = [history[0], ...history.slice(-10)];
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: history as any,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'عذراً، لم أتمكن من معالجة طلبك.';

    // Add AI response to history
    history.push({ role: 'assistant', content: aiResponse });
    conversationHistory.set(userId, history);

    return aiResponse;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return 'عذراً، حدث خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.';
  }
}

// Payment verification
function verifyPayment(amount: number): boolean {
  return amount >= PRODUCT_PRICE;
}

// Send digital product
async function sendDigitalProduct(ctx: BotContext) {
  try {
    await ctx.reply(
      `✅ تم التحقق من الدفع بنجاح!\n\n` +
      `🎁 رابط تحميل المنتج الرقمي:\n${DIGITAL_PRODUCT_URL}\n\n` +
      `شكراً لك على الشراء!`
    );
  } catch (error) {
    console.error('Error sending product:', error);
  }
}

// Bot command handlers
bot.start(async (ctx) => {
  const userId = ctx.from?.id || 0;
  conversationHistory.delete(userId); // Reset conversation

  await ctx.reply(
    `👋 مرحباً بك!\n\n` +
    `أنا مساعدك الذكي المتاح 24/7 لخدمتك.\n\n` +
    `يمكنني مساعدتك في:\n` +
    `✅ الإجابة على استفساراتك\n` +
    `✅ معلومات عن المنتجات\n` +
    `✅ التحقق من المدفوعات\n` +
    `✅ إرسال المنتجات الرقمية\n\n` +
    `كيف يمكنني مساعدتك اليوم؟`
  );
});

bot.command('help', async (ctx) => {
  await ctx.reply(
    `📌 الأوامر المتاحة:\n\n` +
    `/start - بدء محادثة جديدة\n` +
    `/help - عرض المساعدة\n` +
    `/price - عرض السعر\n` +
    `/payment <المبلغ> - التحقق من الدفع وإرسال المنتج\n\n` +
    `يمكنك أيضاً إرسال أي سؤال وسأجيب عليه تلقائياً!`
  );
});

bot.command('price', async (ctx) => {
  await ctx.reply(
    `💰 سعر المنتج الرقمي: ${PRODUCT_PRICE} وحدة نقدية\n\n` +
    `للشراء، قم بإرسال الأمر:\n` +
    `/payment <المبلغ>`
  );
});

bot.command('payment', async (ctx) => {
  const args = ctx.message.text.split(' ');

  if (args.length < 2) {
    await ctx.reply(
      `⚠️ يرجى تحديد المبلغ المدفوع:\n` +
      `مثال: /payment ${PRODUCT_PRICE}`
    );
    return;
  }

  const amount = parseFloat(args[1]);

  if (isNaN(amount)) {
    await ctx.reply('⚠️ المبلغ المدخل غير صحيح. يرجى إدخال رقم صحيح.');
    return;
  }

  if (verifyPayment(amount)) {
    await ctx.reply(
      `✅ تم التحقق من المبلغ: ${amount} وحدة نقدية\n` +
      `المبلغ المطلوب: ${PRODUCT_PRICE} وحدة نقدية\n\n` +
      `جاري إرسال المنتج الرقمي...`
    );

    await sendDigitalProduct(ctx);
  } else {
    await ctx.reply(
      `❌ المبلغ المدفوع (${amount}) أقل من السعر المطلوب (${PRODUCT_PRICE})\n\n` +
      `الفرق: ${(PRODUCT_PRICE - amount).toFixed(2)} وحدة نقدية\n\n` +
      `يرجى إكمال الدفع للحصول على المنتج.`
    );
  }
});

// Handle text messages with AI
bot.on('text', async (ctx) => {
  const userId = ctx.from?.id || 0;
  const message = ctx.message.text;

  // Skip if it's a command
  if (message.startsWith('/')) {
    return;
  }

  try {
    await ctx.sendChatAction('typing');
    const response = await getAIResponse(userId, message);
    await ctx.reply(response);
  } catch (error) {
    console.error('Error handling message:', error);
    await ctx.reply('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.');
  }
});

// Handle voice messages
bot.on('voice', async (ctx) => {
  await ctx.reply(
    `🎤 تم استلام رسالة صوتية.\n\n` +
    `حالياً لا يمكنني معالجة الرسائل الصوتية، لكن يمكنك:\n` +
    `✅ إرسال رسالة نصية\n` +
    `✅ استخدام الأوامر المتاحة (/help)`
  );
});

// Handle video calls/messages
bot.on('video_note', async (ctx) => {
  await ctx.reply(
    `📹 تم استلام رسالة فيديو.\n\n` +
    `يمكنني مساعدتك عبر الرسائل النصية.\n` +
    `اكتب سؤالك وسأجيب عليه فوراً!`
  );
});

// Handle phone calls (Telegram doesn't support this directly, but we can handle call-related messages)
bot.on('contact', async (ctx) => {
  await ctx.reply(
    `📞 شكراً لمشاركة معلومات الاتصال.\n\n` +
    `للتواصل الفوري، يمكنك استخدام الدردشة النصية.\n` +
    `أنا متاح 24/7 للرد على استفساراتك!`
  );
});

// Error handling
bot.catch((err, ctx) => {
  console.error('Bot error:', err);
  ctx.reply('عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
});

export { bot };
