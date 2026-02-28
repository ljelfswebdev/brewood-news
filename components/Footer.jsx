import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-12">
      <div className="container py-6 text-sm text-white/70">
        <div className="flex flex-col gap-2 text-center md:flex-row md:items-center md:justify-between md:text-left">
          <p>&copy; {new Date().getFullYear()} Brewood Cricket Club</p>
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
