import Hero from './home/Hero';
import Identity from './home/Identity';
import Stats from './home/Stats';
import Pillars from './home/Pillars';
import CTA from './home/CTA';

/**
 * Home is a composition, not a 4,000-line file.
 *
 * The previous version was 4,061 lines holding 51 styled-components and around
 * ten simultaneous infinite animations. Each section now lives in ./home/.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Identity />
      <Stats />
      <Pillars />
      <CTA />
    </>
  );
}
