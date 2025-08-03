import Image from "next/image";
import ServicesSection from "./components/ServicesSection";
import CategoryPage from "./categories/page";

export default function Home() {
  return (
 <>
   <ServicesSection></ServicesSection>
   <CategoryPage></CategoryPage>
 </>
  );
}
