import Image from "next/image";
import ServicesSection from "./components/ServicesSection";
import CategoryPage from "./categories/page";
import NewArrivalsSection from "./new-arrivals/page";
import MostViewedSection from "./MostViewedSection/page";
import IphoneCoversSection from "./IphoneCoverSection/page";

import SamsungCoversSection from "./SamsungCoversSection/page";

export default function Home() {
  return (
 <>
   <ServicesSection></ServicesSection>
   <CategoryPage></CategoryPage>
   <NewArrivalsSection></NewArrivalsSection>
   <MostViewedSection></MostViewedSection>
   <IphoneCoversSection></IphoneCoversSection>
   <SamsungCoversSection></SamsungCoversSection>
 </>
  );
}
