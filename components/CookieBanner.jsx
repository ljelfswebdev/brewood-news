'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const CONSENT_COOKIE = 'bcc_cookie_notice';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

function hasConsentCookie() {
  if (typeof document === 'undefined') return true;
  return document.cookie
    .split(';')
    .map((part) => part.trim())
    .some((part) => part.startsWith(`${CONSENT_COOKIE}=accepted`));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(!hasConsentCookie());
  }, []);

  function acceptCookies() {
    document.cookie = `${CONSENT_COOKIE}=accepted; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="container">
        <div className="ml-auto max-w-3xl rounded-2xl border-2 border-primary bg-white p-5 shadow-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h2 className="h5 text-primary">Cookie Notice</h2>
              <p className="text-sm text-gray-700">
                This site uses essential cookies to keep the admin area secure
                and to remember your cookie notice preference. We do not use a
                marketing cookie banner.
              </p>
              <Link
                href="/cookie-policy"
                className="inline-block text-sm font-semibold text-primary underline"
              >
                Read Cookie Policy
              </Link>
            </div>

            <button
              type="button"
              className="button button--primary shrink-0"
              onClick={acceptCookies}
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
