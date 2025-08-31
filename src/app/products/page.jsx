// app/covers/page.jsx
import ServicesSection from "../components/ServicesSection";

export const revalidate = 60; // ISR: re-generate page every 60 seconds

export default async function CoversPage() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/covers?page=1&limit=6`, {
      next: { revalidate: 60 }
    });

    if (!res.ok) {
      throw new Error("Failed to fetch covers");
    }

    const data = await res.json();

    return (
      <main>
        <ServicesSection initialCovers={data.covers} initialTotalCount={data.totalCount} />
      </main>
    );
  } catch (error) {
    console.error(error);
    return <p className="text-center p-6 text-red-600">Failed to load covers.</p>;
  }
}
