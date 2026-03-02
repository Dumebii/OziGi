"use client";
import { CampaignDay } from "../lib/types";
import PostCard from "./PostCard";

export default function DistributionGrid({
  campaign,
}: {
  campaign: CampaignDay[];
}) {
  const platforms = ["X", "LinkedIn", "Discord"];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      {platforms.map((platform) => (
        <div key={platform}>
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600"></span> {platform}{" "}
            Distribution
          </h3>
          <div className="space-y-6">
            {campaign.map((day, idx) => (
              <PostCard
                key={idx}
                day={day.day}
                platform={platform}
                content={String(day[platform.toLowerCase()] || "")}
                webhookUrl=""
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
