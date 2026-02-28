import Image from '@/helpers/Image';
import Reveal from '@/components/animations/Reveal';
import TypewriterText from '@/components/animations/TypewriterText';

export default function Banner({ title }) {
  return (
    <section className="pt-48 pb-32 relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-full z-[1] bg-secondary/40"></div>
      <div className="absolute top-0 left-0 h-full w-full ">
        <Reveal className="h-full w-full" variant="fade-in">
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
        </Reveal>
      </div>
      <div className="container relative z-[2]">
        <div className="hidden lg:block">
          <TypewriterText
            as="h1"
            text={title}
            className="h2 text-white text-center"
            delay={120}
          />
        </div>
        <div className="lg:hidden">
          <Reveal>
            <h1 className="h2 text-white text-center max-w-[900px] mx-auto">
              {title}
            </h1>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
