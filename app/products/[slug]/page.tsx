import { redirect } from "next/navigation";

interface LegacyProductRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function LegacyProductRoute({ params }: LegacyProductRouteProps) {
  const { slug } = await params;
  redirect(`/product/${slug}`);
}
