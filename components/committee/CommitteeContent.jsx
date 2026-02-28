'use client';

import { useEffect, useState } from 'react';
import Image from '@/helpers/Image';
import Reveal from '@/components/animations/Reveal';
import TypewriterText from '@/components/animations/TypewriterText';

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

export default function CommitteeContent({ members = [], emptyText = 'No committee members published yet.' }) {
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
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member, index) => {
            const displayName = getDisplayName(member);
            const firstName = getFirstName(member);
            const baseDelay = index * 45;

            return (
              <Reveal
                as="article"
                key={member._id}
                className="text-center flex flex-col items-center gap-4"
                delay={baseDelay}
              >
                <Reveal
                  className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-primary"
                  variant="fade-in"
                  delay={baseDelay + 20}
                >
                  <Image
                    src={member.image}
                    alt={displayName}
                    fill
                    className="object-cover"
                  />
                </Reveal>

                <TypewriterText
                  as="h2"
                  text={displayName}
                  className="h4"
                  delay={baseDelay + 35}
                />
                {!!String(member.position || '').trim() && (
                  <Reveal delay={baseDelay + 45}>
                    <p className="text text-gray-600 -mt-2">
                      {member.position}
                    </p>
                  </Reveal>
                )}

                <Reveal delay={baseDelay + 60}>
                  <button
                    type="button"
                    className="button button--primary mt-auto"
                    onClick={() => setActiveMember(member)}
                  >
                    Read More About {firstName}
                  </button>
                </Reveal>
              </Reveal>
            );
          })}
        </div>
      ) : (
        <div className="card text-center text-sm text-gray-600">
          {emptyText}
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
                <Image
                  src="/close.svg"
                  alt="Close"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
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
