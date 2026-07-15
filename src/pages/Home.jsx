import Nav from '../components/landing/Nav.jsx';
import Hero from '../components/landing/Hero.jsx';
import Features from '../components/landing/Features.jsx';
import Story from '../components/landing/Story.jsx';
import Quote from '../components/landing/Quote.jsx';
import Preview from '../components/landing/Preview.jsx';
import Footer from '../components/landing/Footer.jsx';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <Features />
      <Story />
      <Quote />
      <Preview />
      <Footer />
    </>
  );
}
