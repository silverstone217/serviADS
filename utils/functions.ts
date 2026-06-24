export const isCampaignRunning = (startDate: Date, duration: number) => {
  const now = new Date();

  const endDate = new Date(
    startDate.getTime() + duration * 7 * 24 * 60 * 60 * 1000,
  );

  return now >= startDate && now <= endDate;
};
