'use client';

import { useEffect, useState } from 'react';
import Image from '@/helpers/Image';

function getDisplayName(member) {
  const first = String(member?.firstName || '').trim();
  const last = String(member?.lastName || '').trim();
  const full = `${first} ${last}`.trim();
  return full || String(member?.title || '').trim() || 'Committee Member';
}

function getFirstName(member) {
  const first = String(member?.firstName || '').trim();
  if (first) return first;
  const title = String(member?.title || '').trim();
  if (!title) return 'Member';
  return title.split(/\s+/)[0] || 'Member';
}

export default function CommitteeContent({ members = [] }) {
  const [activeMember, setActiveMember] = useState(null);

  useEffect(() => {
    if (!activeMember) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setActiveMember(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeMember]);

  return (
    <>
      {members.length ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => {
            const displayName = getDisplayName(member);
            const firstName = getFirstName(member);

            return (
              <article
                key={member._id}
                className="text-center flex flex-col items-center gap-4"
              >
                <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary">
                  <Image
                    src={member.image}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                </div>

                <h2 className="h4">{displayName}</h2>
                {!!String(member.position || '').trim() && (
                  <p className="text text-gray-600 -mt-2">
                    {member.position}
                  </p>
                )}

                <button
                  type="button"
                  className="button button--primary mt-auto"
                  onClick={() => setActiveMember(member)}
                >
                  Read More About {firstName}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="card text-center text-sm text-gray-600">
          No committee members published yet.
        </div>
      )}

      {activeMember && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setActiveMember(null)}
          role="presentation"
        >
          <div
            className="w-full max-w-xl max-h-[80dvh] overflow-hidden rounded-primary bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={`About ${getDisplayName(activeMember)}`}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h3 className="h4">{getDisplayName(activeMember)}</h3>
                {!!String(activeMember.position || '').trim() && (
                  <p className="text-sm text-gray-600">
                    {activeMember.position}
                  </p>
                )}
              </div>
              <button
                type="button"
                className="h-10 w-10"
                onClick={() => setActiveMember(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 32 32"><circle cx="16" cy="16" r="16" fill="#4a56a6"/><path fill="#fff" d="M23.69 8.227a1.375 1.375 0 0 0-.17-1.912 1.32 1.32 0 0 0-1.879.173L16 13.38l-5.641-6.892a1.32 1.32 0 0 0-1.88-.173 1.375 1.375 0 0 0-.17 1.912l5.954 7.273-5.954 7.273a1.375 1.375 0 0 0 .17 1.912c.568.48 1.41.403 1.88-.173L16 17.62l5.641 6.892c.47.576 1.313.653 1.88.173.566-.479.64-1.335.17-1.912L17.737 15.5z"/></svg>
              </button>
            </div>

            <div className="space-y-5 overflow-y-auto pr-1 max-h-[calc(80dvh-8rem)]">
              <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-full border-2 border-primary">
                <Image
                  src={activeMember.image}
                  alt={getDisplayName(activeMember)}
                  fill
                  className="object-cover"
                />
              </div>

              {String(activeMember.about || '').trim() ? (
                <div
                  className="prose max-w-none text-sm text-gray-700"
                  dangerouslySetInnerHTML={{ __html: String(activeMember.about || '') }}
                />
              ) : (
                <p className="text-sm text-gray-700">No bio provided yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
