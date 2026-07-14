import React from "react";
import HeroSection from "./HeroSection";
import iphone from "../../assets/iphone-14-pro.webp";
import mac from "../../assets/mac-system-cut.jfif";
import FeatureProduct from "./FeatureProduct";

const HomePage = () => {
  return (
    <div>
      {/**Hero section */}
      <HeroSection
        title="Buy iPhone 18 Pro"
        subtitle="Experience the power of the latest iPhone 18 with our most Pro camera ever."
        link="/product/6a4e034692dbbe7cbbc5a5ef"
        image={iphone}
      />

      {/**Feature products */}
      <FeatureProduct></FeatureProduct>

      {/**Hero section */}
      <HeroSection
        title="Build the ultimate setup"
        subtitle="You cand add Studio Display and colour-matched Magic accessories to your bag after configure your Mac mini."
        link="/product/6a4e034692dbbe7cbbc5a5f7"
        image={mac}
      />
    </div>
  );
};

export default HomePage;
