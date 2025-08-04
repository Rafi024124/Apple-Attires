import SubcategoryProductsClient from './SubcategoryProductsClient';

export default function SubcategoryPage({ params }) {
  return <SubcategoryProductsClient subcategory={params.subcategory} />;
}

export async function generateStaticParams() {
  const subcategories = [
    'iphone',
    'galaxy',
    'airpods',
    'macbook',
    'apple-watch',
    'ipad',
  ];

  return subcategories.map((subcategory) => ({
    subcategory,
  }));
}
