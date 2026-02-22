// components/forms/ContactSection.jsx
'use client';

import SocialLinksClient from '@/components/socials/SocialLinksClient';
import ContactForm from '@/components/forms/ContactForm';
import ContactCards from './Cards';



export default function ContactSection({ form, contact, socials }) {
  const phone = (contact?.phone || '').trim();
  const email = (contact?.email || '').trim();
  const address = (contact?.address || '').trim();
  const hasContactDetails = Boolean(phone || email || address);

  return (
    <>

    <section className="py-12 border-t-2 border-solid border-grey">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-10">
          {/* LEFT: contact details + socials */}
          <div className="flex flex-col w-full md:w-1/2 space-y-4">
            {hasContactDetails && (
              <ContactCards
                phone={phone}
                email={email}
                address={address}
              />
            )}

            {/* socials use existing client component */}
            <SocialLinksClient className="mt-6" size={24} showLabels={false} />
          </div>

          {/* RIGHT: form */}
          <div className="grow">
            {form ? (
              <ContactForm form={form} />
            ) : (
              <div className="card">
                <h2 className="text-lg font-semibold mb-2">Form not configured</h2>
                <p className="text-sm text-gray-600">
                  No form found with key <code>contact</code>. Go to <code>/admin/forms</code> and create one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
    </>

  );
}
