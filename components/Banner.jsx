'use client';

import { motion } from 'framer-motion';
import Image from '@/helpers/Image';

export default function Banner({ title }) {
  return (
    <section className="pt-48 pb-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-full z-[1] bg-secondary/40"></div>
      <div className="absolute top-0 left-0 h-full w-full ">
          <Image
            src='/hero.png'
            alt="Banner Background"
            width={1920}       
            height={600}
            sizes="100vw"
            quality={60}
            className="object-cover object-center h-full w-full"
            priority
          />
      </div>
      <div className="container relative z-[2]">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h2 text-white text-center"
        >
          {title}
        </motion.h1>
      </div>
    </section>
  );
}
