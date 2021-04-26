import Analytics, { AnalyticsInstance } from "analytics";
import segmentPlugin from "@analytics/segment";

let analytics: AnalyticsInstance;

export const install = (): AnalyticsInstance => {
  if (analytics) {
    return analytics;
  }
  analytics = Analytics({
    app: "sequence-dev",
    plugins: [
      segmentPlugin({
        writeKey: "6obTHUKIOEDqnF6W58FtATd35btSO3yA",
      }),
    ],
  });
  analytics.page();
  return analytics;
};
