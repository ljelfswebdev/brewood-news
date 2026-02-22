// app/contact-us/page.jsx
import dynamic from 'next/dynamic';
import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';
import Form from '@/models/Form';
import Setting from '@/models/Settings';
import Banner from '@/components/Banner';


// lazy-load the whole content section (form + contact details)
const ContactSection = dynamic(
  () => import('@/components/contact/ContactContent'),
  { ssr: false }
);

export default async function ContactUsPage() {
  let title = 'Contact Us';
  let form = null;
  let globalSettings = null;
  try {
    await dbConnect();

    // Fetch the CMS page with slug contact-us
    const page = await Page.findOne({ slug: 'contact-us' }).lean();
    title = page?.title || 'Contact Us';

    // Fetch the form with key "contact"
    form = await Form.findOne({ key: 'contact' }).lean();

    // Fetch global settings (phone/email/etc.)
    globalSettings = await Setting.findOne({ key: 'global' }).lean();
  } catch (error) {
    console.error('Contact page load failed:', error?.message || error);
  }

  const contact = globalSettings?.templateData?.contact || {};
  const socials = globalSettings?.templateData?.socials || {};

  return (
    <main>

      <Banner title={title} />


      {/* Rest of the page (lazy-loaded client chunk) */}
      <ContactSection
        form={form ? JSON.parse(JSON.stringify(form)) : null}
        contact={contact}
        socials={socials}
      />
    </main>
  );
}
