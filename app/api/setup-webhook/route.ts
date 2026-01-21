import { NextRequest, NextResponse } from 'next/server';
import { bot } from '@/lib/telegram';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const webhookDomain = process.env.WEBHOOK_DOMAIN || 'https://agentic-fb49d1d8.vercel.app';
    const webhookUrl = `${webhookDomain}/api/webhook`;

    // Set the webhook
    await bot.telegram.setWebhook(webhookUrl);

    // Get webhook info
    const webhookInfo = await bot.telegram.getWebhookInfo();

    return NextResponse.json({
      success: true,
      message: 'Webhook configured successfully',
      webhookUrl,
      webhookInfo,
    });
  } catch (error: any) {
    console.error('Setup webhook error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to setup webhook',
      },
      { status: 500 }
    );
  }
}
