'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from '@/helpers/Image';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeaderClient({ items }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openParents, setOpenParents] = useState({});
  const pathname = usePathname();

  const toggle = () => {
    setOpen((x) => {
      const next = !x;
      if (!next) setOpenParents({});
      return next;
    });
  };

  const topLevel = Array.isArray(items) ? items : [];

  function itemKey(item, fallback) {
    return String(item?.id || item?._id || item?.label || fallback);
  }

  function parentKey(item, index) {
    return itemKey(item, `mobile-${index}`);
  }

  function toggleParent(parentId) {
    setOpenParents((prev) => ({ ...prev, [parentId]: !prev[parentId] }));
  }

  function close() {
    setOpen(false);
    setOpenParents({});
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 250);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const knownRoutes = [
    '/',
    '/about',
    '/contact-us',
    '/news',
    '/committee',
  ];

  const isKnownRoute =
    knownRoutes.includes(pathname || '') ||
    (pathname || '').startsWith('/news/') ||
    (pathname || '').startsWith('/admin');

  const isScrolled = !isKnownRoute || scrolled;

  const headerClass = [
    'fixed top-0 left-0 w-full z-50 transition-all duration-200', // ✅ was z-30
    open
      ? 'bg-transparent shadow-none text-white'
      : isScrolled
      ? 'bg-white shadow-md text-primary'
      : 'bg-transparent shadow-none text-white',
  ].join(' ');

  const logoSize = isScrolled ? 60 : 140;

  const logoClass = [
    'absolute top-2 left-4 lg:left-0 transition-all duration-200',
    isScrolled ? '!top-1/2 -translate-y-1/2' : 'top-0 translate-y-0',
  ].join(' ');

  const menuVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: 0.05 * i, duration: 0.25 },
    }),
  };

  const desktopNavItemClass = [
    'relative inline-block font-semibold',
    'after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full',
    'after:origin-left after:scale-x-0 after:transition-transform after:duration-200',
    'hover:after:scale-x-100',
    isScrolled ? 'after:bg-primary' : 'after:bg-white',
  ].join(' ');

  return (
    <>
      {/* HEADER */}
      <div className={headerClass}>
        <div className="container flex items-center justify-end py-6 lg:py-8 gap-4 relative">
          {/* LOGO */}
          <Link
            href="/"
            className={`${logoClass} z-50 ${open ? 'hidden' : ''}`}
            style={{ width: logoSize, height: logoSize }}
          >
            <Image
              src={isScrolled ? '/logo.png' : '/logo-white.png'}
              alt="Brewood Cricket Club"
              width={logoSize}
              height={logoSize}
              sizes={isScrolled ? '60px' : '140px'}
              quality={45}
              priority
            />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-6 text-sm">
            {topLevel.map((item, i) => (
              <div key={itemKey(item, `desktop-${i}`)} className="relative group">
                {item.url ? (
                  <Link
                    href={item.url}
                    target={item.target || '_self'}
                    rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className={desktopNavItemClass}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={desktopNavItemClass}>
                    {item.label}
                  </span>
                )}

                {Array.isArray(item.children) && item.children.length > 0 && (
                  <div className="absolute left-0 top-full mt-3 min-w-[200px] rounded-primary border border-gray-100 bg-white p-2 text-black shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    {item.children.map((child, j) => (
                      child.url ? (
                        <Link
                          key={itemKey(child, `desktop-child-${i}-${j}`)}
                          href={child.url}
                          target={child.target || '_self'}
                          rel={child.target === '_blank' ? 'noopener noreferrer' : undefined}
                          className="block rounded px-3 py-2 text-sm hover:bg-gray-100"
                        >
                          {child.label}
                        </Link>
                      ) : (
                        <span
                          key={itemKey(child, `desktop-child-${i}-${j}`)}
                          className="block rounded px-3 py-2 text-sm text-gray-500"
                        >
                          {child.label}
                        </span>
                      )
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* MOBILE HAMBURGER */}
          <button
            type="button"
            onClick={toggle}
            className="z-50 lg:hidden inline-flex flex-col justify-center items-center w-9 h-9"
            aria-label="Toggle navigation"
          >
            <span
              className={[
                'h-1 w-9 rounded-primary transition-transform origin-center',
                open ? 'translate-y-2 rotate-45 !bg-white' : isScrolled ? 'bg-primary' : 'bg-white',
              ].join(' ')}
            />
            <span
              className={[
                'h-1 w-9 rounded-primary my-1 transition-opacity',
                open ? 'opacity-0' : 'opacity-100',
                open ? '!bg-white' : isScrolled ? 'bg-primary' : 'bg-white',
              ].join(' ')}
            />
            <span
              className={[
                'h-1 w-9 rounded-primary transition-transform origin-center',
                open ? '-translate-y-2 -rotate-45 !bg-white' : isScrolled ? 'bg-primary' : 'bg-white',
              ].join(' ')}
            />
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-x-0 top-0 bottom-0 pt-14 bg-secondary text-white lg:hidden z-40" // ✅ below header now
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <div className="h-full overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <nav className="flex flex-col gap-4 px-4 pt-4 text-lg">
                {topLevel.map((item, i) => (
                  <motion.div
                    key={parentKey(item, i)}
                    custom={i}
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 5 }}
                    className="border-b border-white/10 pb-3"
                  >
                    {Array.isArray(item.children) && item.children.length > 0 ? (
                      <button
                        type="button"
                        className="flex w-full items-center justify-between"
                        onClick={() => toggleParent(parentKey(item, i))}
                      >
                        <span>{item.label}</span>
                        <span
                          className={`inline-block transition-transform ${
                            openParents[parentKey(item, i)] ? 'rotate-180' : ''
                          }`}
                        >
                          ▾
                        </span>
                      </button>
                    ) : item.url ? (
                      <Link
                        href={item.url}
                        target={item.target || '_self'}
                        rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                        onClick={close}
                        className="block"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="block">{item.label}</span>
                    )}

                    {Array.isArray(item.children) && item.children.length > 0 && (
                      <div
                        className={`overflow-hidden transition-all ${
                          openParents[parentKey(item, i)] ? 'max-h-96 mt-2' : 'max-h-0'
                        }`}
                      >
                        <div className="space-y-1 pl-3 text-sm text-white/80">
                          {item.url && (
                            <Link
                              href={item.url}
                              target={item.target || '_self'}
                              rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                              onClick={close}
                              className="block py-1 text-white"
                            >
                              {item.label}
                            </Link>
                          )}
                          {item.children.map((child, j) => (
                            <motion.div
                              key={itemKey(child, `mobile-child-${i}-${j}`)}
                              custom={i + j + 0.5}
                              variants={menuVariants}
                              initial="hidden"
                              animate="visible"
                              exit={{ opacity: 0, y: 5 }}
                            >
                              {child.url ? (
                                <Link
                                  href={child.url}
                                  target={child.target || '_self'}
                                  rel={
                                    child.target === '_blank'
                                      ? 'noopener noreferrer'
                                      : undefined
                                  }
                                  onClick={close}
                                  className="block py-1"
                                >
                                  {child.label}
                                </Link>
                              ) : (
                                <span className="block py-1 text-white/70">
                                  {child.label}
                                </span>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
