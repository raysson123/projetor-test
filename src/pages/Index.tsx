
import Header from '@/components/layout/Header';
import Hero from '@/components/sections/Hero';
import Courses from '@/components/sections/Courses';
import EBooks from '@/components/sections/EBooks';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/layout/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Courses />
        {/* <EBooks /> */}
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
