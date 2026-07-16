// IS CAMPAIGN RUNNING
export const isCampaignRunning = (
  startDate: Date,
  duration: number,
): boolean => {
  const now = new Date();

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);

  return now >= startDate && now <= endDate;
};

// NOT STARTED CAMPAIGN
export const isCampaignNotStarted = (startDate: Date): boolean => {
  const now = new Date();

  return now < startDate;
};

// GET CAMPAIGN END DATE
const getCampaignEndDate = (startDate: Date, duration: number): Date => {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);

  return endDate;
};

// IS CAMPAIGN ENDED
export const isCampaignFinished = (
  startDate: Date,
  duration: number,
): boolean => {
  const now = new Date();
  const endDate = getCampaignEndDate(startDate, duration);

  return now > endDate;
};

// GET CAMPAIGN STATUS
export type CampaignStatus = "enregistrement" | "en_cours" | "terminee";

export const getCampaignStatus = (
  startDate: Date,
  duration: number,
): CampaignStatus => {
  const now = new Date();

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + duration);

  if (now < startDate) {
    return "enregistrement";
  }

  if (now > endDate) {
    return "terminee";
  }

  return "en_cours";
};
