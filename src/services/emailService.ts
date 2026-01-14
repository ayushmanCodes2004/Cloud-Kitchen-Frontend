import emailjs from '@emailjs/browser';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = 'service_0imi2rl';
const EMAILJS_PUBLIC_KEY = 'i97hERR272deTG2i4';
const WELCOME_TEMPLATE_ID = 'template_e1mqnsu';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

interface WelcomeEmailParams {
  to_name: string;
  to_email: string;
  user_role: string;
}

export const emailService = {
  /**
   * Send welcome email to new user
   */
  async sendWelcomeEmail(params: WelcomeEmailParams): Promise<boolean> {
    try {
      const templateParams = {
        to_name: params.to_name,
        to_email: params.to_email,
        user_role: params.user_role,
        app_name: 'PlatePal',
        app_url: window.location.origin,
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        WELCOME_TEMPLATE_ID,
        templateParams
      );

      console.log('Welcome email sent successfully:', response);
      return response.status === 200;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  },

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(params: {
    to_name: string;
    to_email: string;
    order_number: string;
    total_amount: number;
  }): Promise<boolean> {
    try {
      // You can create another template for order confirmation
      const templateParams = {
        to_name: params.to_name,
        to_email: params.to_email,
        order_number: params.order_number,
        total_amount: params.total_amount,
        app_name: 'PlatePal',
      };

      // Use a different template ID for order confirmation
      // const response = await emailjs.send(
      //   EMAILJS_SERVICE_ID,
      //   'ORDER_CONFIRMATION_TEMPLATE_ID',
      //   templateParams
      // );

      console.log('Order confirmation email would be sent:', templateParams);
      return true;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  },
};
