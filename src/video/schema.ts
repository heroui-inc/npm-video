import {z} from "zod";

import {sampleDownloadsHistory} from "./fixtures";

export const schema = z.object({
  packageName: z.string(),
  displayName: z.string(),
  description: z.string().optional(),
  publisher: z.string().optional(),
  downloadsTotal: z.number(),
  downloadsHistory: z.array(
    z.object({
      day: z.string(),
      downloads: z.number(),
    }),
  ),
  period: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

export type Props = z.infer<typeof schema>;

export const defaultProps: Props = {
  packageName: "@heroui/react",
  displayName: "@heroui/react",
  description: "Render Remotion compositions inside your web application with ease.",
  publisher: "heroui",
  downloadsTotal: sampleDownloadsHistory.reduce((total, point) => total + point.downloads, 0),
  downloadsHistory: [...sampleDownloadsHistory],
  period: "Last 30 days",
  primaryColor: "#22c55e",
  secondaryColor: "#10b981",
};
