"use server";
import type {Props} from "@/video/schema";

import {getRenderProgress, renderMediaOnLambda} from "@remotion/lambda/client";

import {env} from "@/lib/env";
import {defaultProps, schema} from "@/video/schema";

export async function generateVideo(inputProps: unknown) {
  "use server";
  const props = schema.parse(
    typeof inputProps === "object" ? {...defaultProps, ...inputProps} : {},
  );
  const {renderId, bucketName} = await renderMediaOnLambda({
    region: "us-east-1",
    functionName: env.REMOTION_AWS_FUNCTION_NAME,
    serveUrl: env.REMOTION_SERVE_URL,
    composition: "NpmDownloads",
    inputProps: props,
    codec: "h264",
  });

  return {renderId, bucketName};
}

export async function getVideoGenerationProgress(renderId: string, bucketName: string) {
  "use server";
  const {done, errors, outputFile} = await getRenderProgress({
    region: "us-east-1",
    functionName: env.REMOTION_AWS_FUNCTION_NAME,
    renderId,
    bucketName,
  });
  if (errors) {
    for (const error of errors) {
      console.error(error);
    }
  }

  return {done, error: errors.length > 0, outputFile: outputFile};
}

// NPM Downloads functionality

const fetchWithCache = (input: RequestInfo | URL, init?: RequestInit | undefined) =>
  fetch(input, {
    ...init,
    next: {
      revalidate: 5 * 60,
    },
  });

type NpmDownloadsResponse =
  | {
      downloads: Array<{day: string; downloads: number}>;
      start: string;
      end: string;
      package: string;
    }
  | {
      error: string;
    };

type NpmRegistryResponse = {
  name?: string;
  description?: string;
  author?: {name?: string};
  maintainers?: Array<{name?: string}>;
  "dist-tags"?: Record<string, string>;
};

function getDateRange(timeRange: string): {
  startDate: string;
  endDate: string;
  periodLabel: string;
} {
  const endDate = new Date();
  let startDate = new Date();
  let periodLabel = "";

  switch (timeRange) {
    case "7-days":
      startDate.setDate(endDate.getDate() - 7);
      periodLabel = "Last 7 days";
      break;
    case "30-days":
      startDate.setDate(endDate.getDate() - 30);
      periodLabel = "Last 30 days";
      break;
    case "90-days":
      startDate.setDate(endDate.getDate() - 90);
      periodLabel = "Last 90 days";
      break;
    case "6-months":
      startDate.setMonth(endDate.getMonth() - 6);
      periodLabel = "Last 6 months";
      break;
    case "1-year":
      startDate.setFullYear(endDate.getFullYear() - 1);
      periodLabel = "Last year";
      break;
    case "2-years":
      startDate.setFullYear(endDate.getFullYear() - 2);
      periodLabel = "Last 2 years";
      break;
    case "5-years":
      startDate.setFullYear(endDate.getFullYear() - 5);
      periodLabel = "Last 5 years";
      break;
    case "all-time":
      startDate = new Date("2015-01-01"); // NPM registry started tracking around this time
      periodLabel = "All time";
      break;
    default:
      startDate.setFullYear(endDate.getFullYear() - 2);
      periodLabel = "Last 2 years";
  }

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    periodLabel,
  };
}

export async function getNpmDownloadsInfo(
  packageSpecifier: string,
  timeRange: string = "2-years",
): Promise<Omit<Props, "primaryColor" | "secondaryColor"> | null> {
  const packageName = normalizePackageSpecifier(packageSpecifier);
  if (!packageName) return null;

  const {startDate, endDate, periodLabel} = getDateRange(timeRange);
  const encodedPackage = encodeURIComponent(packageName);

  const downloadsResponse = await fetchWithCache(
    `https://api.npmjs.org/downloads/range/${startDate}:${endDate}/${encodedPackage}`,
  );
  if (!downloadsResponse.ok) return null;

  const downloadsJson = (await downloadsResponse.json()) as NpmDownloadsResponse;
  if (!("downloads" in downloadsJson)) return null;

  // Aggregate data based on the time range to maintain accuracy
  // NPM trends typically shows monthly data for periods > 6 months
  const rawDownloadsHistory = downloadsJson.downloads;
  let downloadsHistory = rawDownloadsHistory;

  // For longer periods, aggregate by month or week
  if (timeRange === "2-years" || timeRange === "5-years" || timeRange === "all-time") {
    // Aggregate by month
    const monthlyData = new Map<string, number>();

    for (const point of rawDownloadsHistory) {
      const date = new Date(`${point.day}T00:00:00.000Z`);
      const monthKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;

      monthlyData.set(monthKey, (monthlyData.get(monthKey) ?? 0) + point.downloads);
    }

    const aggregatedMonthlyHistory = Array.from(monthlyData.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([monthKey, totalDownloads]) => ({
        day: `${monthKey}-01`,
        downloads: totalDownloads,
      }));

    const lastDailyPoint = rawDownloadsHistory.at(-1);
    let filteredMonthlyHistory = aggregatedMonthlyHistory;

    if (lastDailyPoint) {
      const lastDate = new Date(`${lastDailyPoint.day}T00:00:00.000Z`);
      const lastMonthKey = `${lastDate.getUTCFullYear()}-${String(lastDate.getUTCMonth() + 1).padStart(2, "0")}`;
      const lastDayOfMonth = new Date(Date.UTC(lastDate.getUTCFullYear(), lastDate.getUTCMonth() + 1, 0)).getUTCDate();

      if (lastDate.getUTCDate() < lastDayOfMonth) {
        filteredMonthlyHistory = aggregatedMonthlyHistory.filter((point) => {
          const pointDate = new Date(`${point.day}T00:00:00.000Z`);
          const pointMonthKey = `${pointDate.getUTCFullYear()}-${String(pointDate.getUTCMonth() + 1).padStart(2, "0")}`;
          return pointMonthKey !== lastMonthKey;
        });
      }
    }

    downloadsHistory =
      filteredMonthlyHistory.length > 0 ? filteredMonthlyHistory : aggregatedMonthlyHistory;
  } else if (timeRange === "6-months" || timeRange === "1-year") {
    // Aggregate by week
    const weeklyData: Array<{day: string; downloads: number}> = [];

    for (let i = 0; i < downloadsHistory.length; i += 7) {
      const weekChunk = downloadsHistory.slice(i, Math.min(i + 7, downloadsHistory.length));
      if (weekChunk.length > 0) {
        const avgDownloads = Math.round(
          weekChunk.reduce((sum, p) => sum + p.downloads, 0) / weekChunk.length,
        );
        weeklyData.push({
          day: weekChunk[Math.floor(weekChunk.length / 2)].day,
          downloads: avgDownloads,
        });
      }
    }

    downloadsHistory = weeklyData;
  } else if (timeRange === "90-days") {
    // Show every 3 days
    downloadsHistory = downloadsHistory.filter((_, index) => index % 3 === 0);
  }
  // For 7-days and 30-days, keep daily data as is

  const formattedHistory = downloadsHistory.map((point) => ({
    day: point.day,
    downloads: point.downloads,
  }));

  const downloadsTotal = downloadsJson.downloads.reduce(
    (total, point) => total + point.downloads,
    0,
  );

  const registryResponse = await fetchWithCache(`https://registry.npmjs.org/${encodedPackage}`);
  if (!registryResponse.ok) {
    return {
      packageName,
      displayName: packageName,
      downloadsTotal,
      downloadsHistory: formattedHistory,
      period: periodLabel,
    };
  }

  const registryJson = (await registryResponse.json()) as NpmRegistryResponse;
  const displayName = registryJson.name ?? packageName;
  const publisher = registryJson.author?.name ?? registryJson.maintainers?.[0]?.name;

  return {
    packageName,
    displayName,
    description: registryJson.description,
    publisher,
    downloadsTotal,
    downloadsHistory: formattedHistory,
    period: periodLabel,
  };
}

function normalizePackageSpecifier(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const url = new URL(trimmed);
    const isNpmHost = /(^|\.)npmjs\.com$/.test(url.hostname);
    if (isNpmHost) {
      const pathParts = url.pathname.split("/").filter(Boolean);
      const packageIndex = pathParts.findIndex((segment) => segment === "package");
      if (packageIndex >= 0 && pathParts[packageIndex + 1]) {
        return decodeURIComponent(pathParts.slice(packageIndex + 1).join("/"));
      }
      if (pathParts.length >= 1) {
        return decodeURIComponent(pathParts.join("/"));
      }
    }
  } catch {
    // ignore, not a URL
  }

  return trimmed.replace(/^npm:/, "");
}
