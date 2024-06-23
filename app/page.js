"use client"
import Header from '@/src/components/landing/Header';
import Landing from '@/src/components/landing/Landing';
import Features from '@/src/components/landing/Features';
import Demo from '@/src/components/landing/Demo';
import Footer from '@/src/components/landing/Footer';

const Home = () => {
  return (
    <>
      <div className="h-full leading-normal text-gray-600">
        <div
          className="absolute top-0 left-0 right-0 bg-no-repeat bg-cover shadow-lg -bottom-full brightness-90 filter bg-center bottom-0 md:brightness-100"
          style={{
            backgroundImage: "url('images/splash.jpg')",
          }}
        />
        <Header />
        <Landing />
        <Features />
        <Demo />
        <Footer />
      </div>
    </>
  );
};

export default Home;