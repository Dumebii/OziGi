export interface CampaignDay {
  day: number;
  x: string;
  linkedin: string;
  discord: string;
  // This index signature is vital for dynamic platform access
  [key: string]: string | number;
}
