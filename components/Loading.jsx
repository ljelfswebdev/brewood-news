'use client';
import Image from "next/image";


export default function Loading({  }) {
  return (
    <section className="bg-secondary/20 fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
        <Image
            src="/logo.svg"   // lives in /public
            alt="Brochure CMS"
            width={500}       // tweak to suit
            height={300}
            priority          // keep logo crisp
          />
    </section>
  );
}