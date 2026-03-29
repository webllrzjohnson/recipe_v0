import type { LegalPageContent } from './types';

/** Template wording — have counsel review before production. */
export const legalPagesEn: Record<string, LegalPageContent> = {
  privacy: {
    title: 'Privacy Policy',
    description:
      'How Sarap Kitchen collects, uses, and protects your personal information.',
    sections: [
      {
        title: 'Introduction',
        paragraphs: [
          'This Privacy Policy describes how we handle information when you visit our website, use our services, or interact with features such as optional account areas.',
          'By using the site, you agree to this policy. If you do not agree, please discontinue use of the site.',
        ],
      },
      {
        title: 'Who we are',
        paragraphs: [
          'The site is operated as “Sarap Kitchen” (the “Operator”). For data-protection requests, contact us using the details provided on our About page or your hosting provider’s abuse contact until a dedicated privacy inbox is published.',
        ],
      },
      {
        title: 'Information we collect',
        paragraphs: [
          'Usage and technical data: pages viewed, approximate location derived from IP, browser type, device type, referrer, and timestamps. This helps us operate and improve the site.',
          'Account and authentication data: if you sign in to administrative or restricted areas, our authentication provider (e.g. Supabase Auth) processes your email and account identifiers as described in their documentation.',
          'Content you provide: messages, feedback, or other information you send to us may be processed to respond or display content as intended.',
          'We do not knowingly sell your personal information.',
        ],
      },
      {
        title: 'Cookies and similar technologies',
        paragraphs: [
          'We use cookies and similar storage for essential site operation, preferences, and (if you accept) analytics. See our Cookie Policy for types, purposes, and choices.',
        ],
      },
      {
        title: 'How we use information',
        paragraphs: [
          'To provide and secure the website; to measure performance and audience; to comply with law; to enforce our terms; and to communicate with you when you contact us.',
        ],
      },
      {
        title: 'Legal bases (EEA, UK, and similar jurisdictions)',
        paragraphs: [
          'Where applicable, we rely on: your consent (e.g. non-essential cookies); performance of a contract or steps prior to contract; legitimate interests (e.g. site security, analytics balanced against your rights); and legal obligation.',
        ],
      },
      {
        title: 'Sharing and processors',
        paragraphs: [
          'We use service providers to host the site, store data, authenticate users, and measure traffic. Examples may include Vercel (hosting/analytics), Supabase (database and auth), and email delivery services if used. They process data on our instructions and under contractual safeguards where required.',
        ],
      },
      {
        title: 'Retention',
        paragraphs: [
          'We keep information only as long as needed for the purposes above, unless a longer period is required by law. Technical logs may be retained for a limited time for security.',
        ],
      },
      {
        title: 'International transfers',
        paragraphs: [
          'Providers may process data in countries outside your own. Where required, we use appropriate safeguards such as standard contractual clauses.',
        ],
      },
      {
        title: 'Your rights',
        paragraphs: [
          'Depending on your location, you may have the right to access, rectify, erase, restrict, or port your data, and to object to certain processing. You may withdraw consent where processing is consent-based (e.g. optional cookies). You may complain to a supervisory authority.',
          'To exercise rights, contact us with a description of your request. We may need to verify your identity.',
        ],
      },
      {
        title: 'Children',
        paragraphs: [
          'The site is not directed at children under 13 (or the age required in your jurisdiction). We do not knowingly collect personal information from children. Contact us if you believe we have done so.',
        ],
      },
      {
        title: 'Changes',
        paragraphs: [
          'We may update this policy from time to time. The “Last updated” date at the top of this page will change when we do. Continued use after changes constitutes acceptance where permitted by law.',
        ],
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    description:
      'Rules governing your use of the Sarap Kitchen website and services.',
    sections: [
      {
        title: 'Agreement',
        paragraphs: [
          'These Terms of Use (“Terms”) govern access to and use of the website and related services (collectively, the “Service”). By using the Service, you agree to these Terms.',
        ],
      },
      {
        title: 'The Service',
        paragraphs: [
          'We provide recipe-related content, editorial features, and optional tools (such as administrative interfaces for authorized users). We may modify or discontinue features with or without notice.',
        ],
      },
      {
        title: 'Accounts',
        paragraphs: [
          'Certain features may require an account. You must provide accurate information and keep credentials confidential. You are responsible for activity under your account. Notify us of unauthorized use.',
        ],
      },
      {
        title: 'Acceptable use',
        paragraphs: [
          'You agree not to: violate law; infringe others’ rights; attempt unauthorized access; interfere with the Service; distribute malware; scrape in a way that harms the Service; or use the Service for unsolicited marketing without permission.',
        ],
      },
      {
        title: 'Intellectual property',
        paragraphs: [
          'The Service, including design, text, graphics, logos, and software, is owned by the Operator or licensors and protected by intellectual property laws. Limited license: you may view and print content for personal, non-commercial use, subject to these Terms.',
          'You may not reproduce, publicly display, or create derivative works from our content without prior written consent, except as allowed by law.',
        ],
      },
      {
        title: 'User content',
        paragraphs: [
          'If you submit content, you grant us a non-exclusive license to host, display, and use it to operate the Service. You represent you have the rights to grant this license.',
        ],
      },
      {
        title: 'Third-party links',
        paragraphs: [
          'The Service may link to third-party sites. We are not responsible for their content or practices. Review their terms and privacy policies.',
        ],
      },
      {
        title: 'Disclaimer of warranties',
        paragraphs: [
          'THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE” WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.',
        ],
      },
      {
        title: 'Limitation of liability',
        paragraphs: [
          'TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE OPERATOR SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL. TOTAL LIABILITY FOR CLAIMS ARISING FROM THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) AMOUNTS YOU PAID US IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) ONE HUNDRED U.S. DOLLARS, IF YOU HAVE NOT PAID US.',
          'Some jurisdictions do not allow certain limitations; in those cases, our liability is limited to the fullest extent permitted.',
        ],
      },
      {
        title: 'Indemnity',
        paragraphs: [
          'You will defend and indemnify the Operator against claims arising from your use of the Service, your content, or your violation of these Terms, to the extent permitted by law.',
        ],
      },
      {
        title: 'Termination',
        paragraphs: [
          'We may suspend or terminate access for violation of these Terms or for operational reasons. Provisions that by nature should survive will survive termination.',
        ],
      },
      {
        title: 'Governing law',
        paragraphs: [
          'These Terms are governed by the laws of the jurisdiction in which the Operator is established, without regard to conflict-of-law rules, unless mandatory consumer protections in your country provide otherwise.',
        ],
      },
      {
        title: 'Contact',
        paragraphs: [
          'For questions about these Terms, contact us using the information on the About page or your published site contact method.',
        ],
      },
    ],
  },
  disclaimer: {
    title: 'Disclaimer',
    description:
      'Important limitations regarding recipes, nutrition, and health information on Sarap Kitchen.',
    sections: [
      {
        title: 'General information only',
        paragraphs: [
          'All recipes, articles, tips, and related content on this site are for general informational and educational purposes. They are not a substitute for professional advice.',
        ],
      },
      {
        title: 'Not medical or dietary advice',
        paragraphs: [
          'Nothing on this site is medical, nutritional, or dietetic advice. Consult a qualified health professional before changing your diet, especially if you have allergies, medical conditions, or special dietary needs.',
        ],
      },
      {
        title: 'Allergens and food safety',
        paragraphs: [
          'Ingredients, brands, and cross-contact vary. Always read product labels and follow safe food-handling practices. We do not guarantee that recipes are free of allergens or suitable for any specific condition.',
        ],
      },
      {
        title: 'Results may vary',
        paragraphs: [
          'Cooking results depend on equipment, ingredients, skill, and environment. Nutrition figures, where shown, are estimates unless stated otherwise and may not match your preparation.',
        ],
      },
      {
        title: 'No warranty',
        paragraphs: [
          'We provide content “as is” without warranty of any kind. You use recipes and information at your own risk.',
        ],
      },
      {
        title: 'External resources',
        paragraphs: [
          'Links to third parties are for convenience. We do not endorse and are not responsible for external content, products, or services.',
        ],
      },
    ],
  },
  cookies: {
    title: 'Cookie Policy',
    description:
      'How Sarap Kitchen uses cookies and how you can control them.',
    sections: [
      {
        title: 'What are cookies?',
        paragraphs: [
          'Cookies are small text files stored on your device when you visit a site. They help the site remember settings, keep you signed in where applicable, and understand how the site is used.',
        ],
      },
      {
        title: 'How we use cookies',
        paragraphs: [
          'Essential: required for core functionality (e.g. security, load balancing, locale or consent preferences).',
          'Analytics: if you choose “Accept all” in our banner (where available), we may use analytics tools to measure traffic and performance — for example Vercel Analytics or similar services.',
          'Functional: optional preferences you set (e.g. theme) may be stored in local storage or cookies.',
        ],
      },
      {
        title: 'Third-party cookies',
        paragraphs: [
          'Some cookies may be set by our hosting or analytics providers. Their use is described in their respective policies.',
        ],
      },
      {
        title: 'Your choices',
        paragraphs: [
          'You can control cookies through our on-site banner (essential vs. accept all) where implemented, and through your browser settings (block or delete cookies). Blocking essential cookies may affect site behavior.',
        ],
      },
      {
        title: 'Do Not Track',
        paragraphs: [
          'There is no consistent industry standard for “Do Not Track.” We treat consent through our banner and browser settings as primary signals where applicable.',
        ],
      },
      {
        title: 'Updates',
        paragraphs: [
          'We may update this Cookie Policy when our practices change. Check this page periodically. Significant changes may be reflected in the site banner or Privacy Policy.',
        ],
      },
    ],
  },
};
