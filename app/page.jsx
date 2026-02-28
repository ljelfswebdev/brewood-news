import { dbConnect } from '@helpers/db';
import Page from '@/models/Page';
import HeroSection from '@/components/Homepage/HeroSection';
import SponsorsSection from '@/components/Homepage/SponsorsSection';
import BlueBanner from '@/components/Homepage/BlueBanner';
import FeaturesSection from '@/components/Homepage/FeaturesSection';

// ✅ server component (fetches from DB) — DO NOT ssr:false this
import NewsSlider from '@/components/Homepage/NewsSlider';

export default async function HomePage() {
  let page = null;
  try {
    await dbConnect();
    page = await Page.findOne({ templateKey: 'homepage' }).lean();
  } catch (error) {
    console.error('Home page data load failed:', error?.message || error);
  }

  if (!page) {
    return (
      <section className="container py-10">
        <h1 className="text-2xl font-semibold mb-2">Homepage not set up</h1>
        <p className="text-sm text-gray-600">
          Create a page in the admin and assign it the <code>homepage</code> template.
        </p>
      </section>
    );
  }

  const data = page.templateData || {};
  const section1 = data.section1 || {};
  const section2 = data.section2 || {};
  const section3 = data.section3 || {};

  

  return (
    <>
      <HeroSection data={section1} />
      <FeaturesSection data={section3} />
      <SponsorsSection />
      <BlueBanner data={section2} />
      <NewsSlider />
    </>
  );
}
