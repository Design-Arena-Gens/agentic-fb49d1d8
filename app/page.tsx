import React from 'react';

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '600px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '20px' }}>🤖</div>
        <h1 style={{
          fontSize: '32px',
          color: '#333',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>
          Telegram AI Agent
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '30px',
          textAlign: 'right',
          direction: 'rtl'
        }}>
          مساعد ذكي متقدم لتليجرام مع قدرات:<br/>
          ✅ الرد التلقائي على الرسائل<br/>
          ✅ الإجابة الذكية باستخدام AI<br/>
          ✅ التعامل مع المكالمات والرسائل الصوتية<br/>
          ✅ التحقق من المدفوعات<br/>
          ✅ إرسال المنتجات الرقمية تلقائياً<br/>
        </p>

        <div style={{
          background: '#f7f7f7',
          borderRadius: '10px',
          padding: '20px',
          marginTop: '30px',
          textAlign: 'left'
        }}>
          <h2 style={{
            fontSize: '20px',
            color: '#667eea',
            marginBottom: '15px'
          }}>
            Setup Instructions
          </h2>
          <ol style={{
            fontSize: '14px',
            color: '#555',
            lineHeight: '1.8',
            paddingLeft: '20px'
          }}>
            <li>Create a Telegram bot via @BotFather</li>
            <li>Get your OpenAI API key</li>
            <li>Set environment variables in Vercel:
              <ul style={{ marginTop: '10px', fontSize: '13px' }}>
                <li><code>TELEGRAM_BOT_TOKEN</code></li>
                <li><code>OPENAI_API_KEY</code></li>
                <li><code>WEBHOOK_DOMAIN</code></li>
                <li><code>PRODUCT_PRICE</code></li>
                <li><code>DIGITAL_PRODUCT_URL</code></li>
              </ul>
            </li>
            <li>Visit <code>/api/setup-webhook</code> to configure</li>
            <li>Start chatting with your bot!</li>
          </ol>
        </div>

        <div style={{
          marginTop: '30px',
          padding: '15px',
          background: '#e3f2fd',
          borderRadius: '10px',
          fontSize: '14px',
          color: '#1976d2'
        }}>
          <strong>Status:</strong> Bot is ready to receive webhooks
        </div>

        <div style={{
          marginTop: '20px',
          fontSize: '12px',
          color: '#999'
        }}>
          Powered by OpenAI GPT-3.5 & Telegraf
        </div>
      </div>
    </div>
  );
}
