import React from "react";
import Hero from "../../components/Hero/Hero";
import Services from "../../components/Services/Services";
import Ministries from "../../components/Ministries/Ministries";
import News from "../../components/News/News";
import Contact from "../../components/Contact/Contact";

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <Services />
      <Ministries />
      <News />
      <Contact />
    </div>
  );
};

export default HomePage;
