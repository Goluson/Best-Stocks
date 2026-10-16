import emailjs from '@emailjs/browser';

export interface EmailServiceSettings {
  provider: 'emailjs' | 'resend';
  // EmailJS keys
  emailjsServiceId?: string;
  emailjsTemplateId?: string;
  emailjsPublicKey?: string;
  // Resend API key
  resendApiKey?: string;
}

const DEFAULT_SETTINGS: EmailServiceSettings = {
  provider: 'emailjs',
  emailjsServiceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  emailjsTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  emailjsPublicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  resendApiKey: import.meta.env.VITE_RESEND_API_KEY || '',
};

export function getSavedEmailSettings(): EmailServiceSettings {
  try {
    const saved = localStorage.getItem('beststocks_email_settings');
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (e) {
    // Ignore error
  }
  return DEFAULT_SETTINGS;
}

export function saveEmailSettings(settings: EmailServiceSettings) {
  try {
    localStorage.setItem('beststocks_email_settings', JSON.stringify(settings));
  } catch (e) {
    // Ignore error
  }
}

/**
 * Dispatches a real email with the 6-digit OTP to the user's email address.
 */
export async function sendOtpToEmail(
  toEmail: string,
  otpCode: string
): Promise<{ success: boolean; isConfigured: boolean; error?: string }> {
  const settings = getSavedEmailSettings();

  // 1. Try Resend API if configured
  if (settings.provider === 'resend' && settings.resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${settings.resendApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'BestStocks AI <onboarding@resend.dev>',
          to: [toEmail.trim()],
          subject: `${otpCode} is your BestStocks verification code`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; background: #0f172a; color: #f8fafc; border-radius: 12px;">
              <h2 style="color: #10b981;">BestStocks AI Verification</h2>
              <p>Your 6-digit verification code to sign in is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #38bdf8; padding: 12px 0;">
                ${otpCode}
              </div>
              <p style="color: #94a3b8; font-size: 12px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
          `,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return { success: false, isConfigured: true, error: errorData?.message || 'Failed to send via Resend.' };
      }
      return { success: true, isConfigured: true };
    } catch (err: any) {
      return { success: false, isConfigured: true, error: err?.message || 'Network error sending email.' };
    }
  }

  // 2. Try EmailJS if configured
  if (settings.emailjsServiceId && settings.emailjsTemplateId && settings.emailjsPublicKey) {
    try {
      await emailjs.send(
        settings.emailjsServiceId,
        settings.emailjsTemplateId,
        {
          to_email: toEmail.trim(),
          user_email: toEmail.trim(),
          otp_code: otpCode,
          message: `Your BestStocks AI OTP code is ${otpCode}`,
          app_name: 'BestStocks AI',
        },
        settings.emailjsPublicKey
      );
      return { success: true, isConfigured: true };
    } catch (err: any) {
      console.warn('EmailJS delivery warning:', err);
      return { 
        success: false, 
        isConfigured: true, 
        error: err?.text || err?.message || 'Failed to dispatch via EmailJS.' 
      };
    }
  }

  // No active provider configured
  return { 
    success: false, 
    isConfigured: false, 
    error: 'No email delivery provider configured yet.' 
  };
}
