import Image from '@/helpers/Image';

export default function Banner({ title }) {
  return (
    <section className="pt-48 pb-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-full z-[1] bg-secondary/40"></div>
      <div className="absolute top-0 left-0 h-full w-full ">
        <div className="h-full w-full banner-zoom">
          <Image
            src='/hero.png'
            alt="Banner Background"
            width={1920}       
            height={600}
            sizes="100vw"
            quality={50}
            className="object-cover object-center h-full w-full"
            priority
          />
        </div>
      </div>
      <div className="container relative z-[2]">
        <h1 className="text-white text-center">
          {title}
        </h1>
      </div>
    </section>
  );
}
