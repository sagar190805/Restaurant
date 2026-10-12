import React from 'react';
import { Layout, Breadcrumbs } from '@/components/Layout';

const pages = {
  privacy: {
    title: '🔒 Privacy Policy',
    content: [
      { h: 'Information We Collect', p: 'We collect your name, phone number, delivery address, and order history to provide our food delivery service. We do not share your personal data with third parties except for delivery partners.' },
      { h: 'How We Use Your Information', p: 'Your information is used to process orders, send delivery updates via SMS, and improve our service. With your consent, we may send promotional offers.' },
      { h: 'Data Security', p: 'We use industry-standard encryption to protect your data. Payment information is processed securely through Razorpay and is never stored on our servers.' },
      { h: 'Your Rights', p: 'You may request deletion of your account and associated data at any time by contacting us at hello@spiceroute.in.' },
      { h: 'Contact', p: 'For privacy concerns, email us at privacy@spiceroute.in or call +91 98765 43210.' },
    ],
  },
  terms: {
    title: '📄 Terms & Conditions',
    content: [
      { h: 'Acceptance of Terms', p: 'By using our app or website, you agree to these terms. If you do not agree, please do not use our services.' },
      { h: 'Ordering Policy', p: 'All orders are subject to availability. We reserve the right to cancel orders due to unavailability, delivery constraints, or suspected fraud.' },
      { h: 'Pricing', p: 'Prices are inclusive of taxes unless stated otherwise. Prices are subject to change without notice.' },
      { h: 'Account Responsibility', p: 'You are responsible for maintaining the confidentiality of your account. Report any unauthorised use to us immediately.' },
      { h: 'Governing Law', p: 'These terms are governed by Indian law and disputes are subject to the jurisdiction of courts in Bangalore, Karnataka.' },
    ],
  },
  'refund-policy': {
    title: '↩️ Refund & Cancellation Policy',
    content: [
      { h: 'Cancellation Window', p: 'Orders can be cancelled within 2 minutes of placement. After this window, the kitchen has begun preparation and cancellation is not possible.' },
      { h: 'Refund Timeline', p: 'Approved refunds are processed within 5–7 business days to your original payment method. UPI refunds are typically instant.' },
      { h: 'Eligible Scenarios', p: 'Refunds are issued for wrong items delivered, missing items, significantly delayed delivery (beyond 90 minutes), or quality issues reported within 30 minutes of delivery.' },
      { h: 'Non-Refundable Cases', p: 'Taste preferences, customer-side address errors, and COD orders are not eligible for refunds.' },
      { h: 'How to Claim', p: 'Contact us via WhatsApp +91 98765 43210 or email hello@spiceroute.in with your order ID and issue description within 30 minutes of delivery.' },
    ],
  },
  'delivery-policy': {
    title: '🛵 Delivery Policy',
    content: [
      { h: 'Delivery Area', p: 'We deliver within a 7km radius of our restaurant in Indiranagar, Bangalore. Delivery fees are calculated based on distance.' },
      { h: 'Delivery Charges', p: 'Orders above ₹499 qualify for free delivery. Below ₹499, a delivery fee of ₹40 applies. Premium slots may have higher charges.' },
      { h: 'Delivery Time', p: 'Estimated delivery time is 30–45 minutes from order confirmation. During peak hours or bad weather, times may increase.' },
      { h: 'Contactless Delivery', p: 'We offer contactless delivery on request. Please add a note at checkout for the rider to leave the order at your door.' },
      { h: 'Failed Delivery', p: 'If delivery fails due to an incorrect address or unavailability of the customer, a re-delivery fee may apply.' },
    ],
  },
  faq: {
    title: '❓ Frequently Asked Questions',
    content: [
      { h: 'How do I place an order?', p: 'Browse our menu, add items to your cart, and proceed to checkout. You\'ll need to log in with your mobile number via OTP.' },
      { h: 'Can I schedule an order?', p: 'Yes! During checkout, choose "Schedule" instead of "Deliver Now" and pick your preferred date and time slot.' },
      { h: 'Do you offer bulk/catering orders?', p: 'Yes, we cater for corporate events and private parties. Contact us at catering@spiceroute.in for a custom quote.' },
      { h: 'Are your ingredients fresh?', p: 'Absolutely! We source fresh vegetables and meats daily from trusted local suppliers. No frozen shortcuts.' },
      { h: 'Do you have parking?', p: 'We have valet parking available at our restaurant during dinner hours (7 PM – 11 PM). Street parking is also available.' },
    ],
  },
};

export function StaticPage({ slug }) {
  const page = pages[slug];
  if (!page) return null;
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Breadcrumbs items={[{ label: page.title.replace(/[^\w\s]/gi, '').trim() }]} />
        <h1 className="text-4xl font-black font-serif mb-2">{page.title}</h1>
        <p className="text-muted-foreground text-sm mb-8">Last updated: September 2026</p>
        <div className="space-y-8">
          {page.content.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-black mb-2">{section.h}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.p}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export const Privacy = () => <StaticPage slug="privacy" />;
export const Terms = () => <StaticPage slug="terms" />;
export const RefundPolicy = () => <StaticPage slug="refund-policy" />;
export const DeliveryPolicy = () => <StaticPage slug="delivery-policy" />;
export const FAQ = () => <StaticPage slug="faq" />;
