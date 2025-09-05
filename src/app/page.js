import Image from "next/image";
import ServicesSection from "./components/ServicesSection";
import CategoryPage from "./categories/page";
import NewArrivalsSection from "./new-arrivals/page";
import MostViewedSection from "./MostViewedSection/page";
import IphoneCoversSection from "./IphoneCoverSection/page";

import SamsungCoversSection from "./SamsungCoversSection/page";
import Banner from "@/components/Banner";
import Footer from "./components/Footer/Footer";

export default function Home() {
  return (
 <>
   <Banner></Banner>
   <CategoryPage></CategoryPage>
   <ServicesSection></ServicesSection>
   
   <NewArrivalsSection></NewArrivalsSection>
   <MostViewedSection></MostViewedSection>
   <IphoneCoversSection></IphoneCoversSection>
   <SamsungCoversSection></SamsungCoversSection>
 
 </>
  );
}
