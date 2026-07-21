import { getTaxiById } from "@/actions/users";
import TaxiDetailClient from "@/components/admins/users/TaxiDetailClient";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaxiDetailPage({ params }: PageProps) {
  const { id } = await params;
  const taxi = await getTaxiById(id);

  if (!taxi) {
    notFound();
  }

  return <TaxiDetailClient taxi={taxi} />;
}
