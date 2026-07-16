import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import SubscriptionDetailsClient from "@/components/my-space/SubscriptionDetailsClient";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function SubscriptionDetailsPage({ params }: Props) {
  const id = (await params).id;

  const subscription = await prisma.audioSubscriber.findUnique({
    where: { id: id },
    include: {
      audioCampaign: true,
    },
  });

  if (!subscription) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <SubscriptionDetailsClient subscription={subscription} />
      <br />
    </div>
  );
}
