import type {Props} from "./schema";

import NumberFlow, {continuous} from "@number-flow/react";
import {adjustHue, darken, getLuminance, lighten, transparentize} from "color2k";
import {useMemo} from "react";
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from "remotion";

export const animationDurationInSeconds = 3;
export const width = 1280;
export const height = 720;
export const fps = 60;

const chartWidth = 1260;
const chartHeight = 330;
const chartPadding = 58;

export function NpmDownloadsComposition({
  displayName,
  description,
  publisher,
  downloadsTotal,
  downloadsHistory,
  period,
  primaryColor = "#22c55e",
  secondaryColor = "#10b981",
}: Props) {
  const luminance = getLuminance(primaryColor);

  const complementaryPrimaryColor = adjustHue(
    transparentize(primaryColor, luminance >= 0.7 ? 0.7 : luminance >= 0.5 ? 0.5 : 0.4),
    10,
  );
  const backgroundColor = darken(primaryColor, 0.9);

  return (
    <AbsoluteFill style={{backgroundColor}}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(165deg,
        ${darken(complementaryPrimaryColor, 0.28)} 0%,
        ${darken(complementaryPrimaryColor, 0.6)} 35%,
        ${darken(complementaryPrimaryColor, 0.9)} 70%,
          rgba(0, 0, 0, 1) 100%)`,
          // @ts-ignore
          "--primary-color": primaryColor,
          // @ts-ignore
          "--secondary-color": secondaryColor,
        }}
      >
        <div className="flex flex-col h-full gap-10 p-16">
          <div className="flex justify-between px-2">
            <header className="flex flex-col gap-4">
              <span className="uppercase tracking-[0.4em] text-xs text-white/60">
                npm downloads
              </span>
              <h1 className="text-[64px] leading-none font-bold tracking-tight text-white">
                {displayName}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-lg text-white/80 max-w-[480px]">
                {description && (
                  <p className="max-w-3xl text-white/70 text-xl truncate">{description}</p>
                )}
                {publisher && (
                  <span
                    className="px-3 py-1 rounded-full border"
                    style={{
                      color: lighten(primaryColor, 0.2),
                      backgroundColor: transparentize(primaryColor, 0.9),
                      borderColor: darken(primaryColor, 0.38),
                    }}
                  >
                    {publisher}
                  </span>
                )}
              </div>
            </header>
            <aside className="w-[full flex flex-col justify-between">
              <DownloadsCounter downloads={downloadsTotal} primaryColor={primaryColor} />
            </aside>
          </div>
          <div className="flex flex-1 gap-12">
            <div className="flex-1 relative">
              <DownloadsChart
                history={downloadsHistory}
                period={period}
                primaryColor={primaryColor}
                secondaryColor={secondaryColor}
              />
            </div>
          </div>
        </div>
        {/* Bottom left watermark */}
        <div className="absolute bottom-[22px] left-[74px] text-white/30 text-md font-medium">
          npmvideo.com
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

function DownloadsCounter({downloads, primaryColor}: {downloads: number; primaryColor: string}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const animatedValue = Math.round(
    interpolate(frame, [0, animationDurationInSeconds * fps], [0, downloads], {
      extrapolateRight: "clamp",
      easing: Easing.bezier(0.2, 0.9, 0.2, 1),
    }),
  );

  return (
    <NumberFlow
      value={animatedValue}
      plugins={[continuous]}
      format={{
        notation: "standard",
        maximumFractionDigits: 1,
      }}
      className="text-[84px] leading-none font-bold text-white text-right slashed-zero tabular-nums"
      animated={true}
      trend={animatedValue > 0 ? 1 : 0}
    />
  );
}

function DownloadsChart({
  history,
  period,
  primaryColor,
  secondaryColor,
}: {
  history: Props["downloadsHistory"];
  period?: string;
  primaryColor: string;
  secondaryColor: string;
}) {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  if (history.length === 0) {
    return (
      <div className="h-full w-full rounded-3xl border border-white/10 bg-white/5 flex items-center justify-center text-white/70 text-xl">
        No download data available
      </div>
    );
  }

  const progress = interpolate(frame, [fps * 0.5, animationDurationInSeconds * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.3, 1, 0.3, 1),
  });

  const chart = useMemo(() => prepareChart(history), [history]);

  const visibleLength = chart.pathLength * Math.max(progress, 0.0001);
  const dashOffset = chart.pathLength - visibleLength;

  return (
    <div className="h-full w-full rounded-3xl border border-white/10 bg-white/5 px-12 pt-6 pb-12 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <span className="uppercase text-xs tracking-[0.25em] text-white/60">Download trend</span>
        {period && <span className="text-white/60 text-sm tracking-wide">{period}</span>}
      </div>
      <div className="relative flex-1">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
        >
          <defs>
            <linearGradient
              id="line"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={primaryColor} />
              <stop offset="100%" stopColor={secondaryColor} />
            </linearGradient>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.45" />
              <stop offset="100%" stopColor={secondaryColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {chart.gridLines.map((line) => (
            <g key={line.value}>
              <line
                x1={chartPadding}
                x2={chartWidth - chartPadding}
                y1={line.y}
                y2={line.y}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={1}
              />
              <text
                x={chartPadding - 12}
                y={line.y}
                textAnchor="end"
                dominantBaseline="middle"
                fill="rgba(226,232,240,0.4)"
                fontSize={18}
                fontFamily="Inter, sans-serif"
              >
                {formatDownloads(line.value)}
              </text>
            </g>
          ))}
          <path d={chart.areaPath} fill="url(#area)" opacity={Math.min(progress + 0.1, 1)} />
          <path
            d={chart.path}
            fill="none"
            stroke="url(#line)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: chart.pathLength,
              strokeDashoffset: dashOffset,
            }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-0 translate-y-full mt-6 flex justify-between text-sm text-white/60 uppercase tracking-[0.2em]">
          {chart.labels.map((label) => (
            <span key={label.day}>{label.text}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

type ChartPoint = {
  day: string;
  downloads: number;
  x: number;
  y: number;
};

type ChartData = {
  points: ChartPoint[];
  path: string;
  areaPath: string;
  pathLength: number;
  gridLines: Array<{value: number; y: number}>;
  labels: Array<{day: string; text: string}>;
  maxDownloads: number;
};

function prepareChart(history: Props["downloadsHistory"]): ChartData {
  const maxDownloads = history.reduce((max, point) => Math.max(max, point.downloads), 0) || 1;

  const usableWidth = chartWidth - chartPadding * 2;
  const usableHeight = chartHeight - chartPadding * 2;

  const points = history.map((point, index) => {
    const progress = history.length > 1 ? index / (history.length - 1) : 0.5;
    const x = chartPadding + usableWidth * progress;
    const scaledDownloads = point.downloads / maxDownloads;
    const y = chartHeight - chartPadding - usableHeight * (scaledDownloads || 0);

    return {
      day: point.day,
      downloads: point.downloads,
      x,
      y,
    };
  });

  const path = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");

  const areaPath = [
    path,
    points.length
      ? `L ${points[points.length - 1].x.toFixed(2)} ${(chartHeight - chartPadding).toFixed(2)}`
      : "",
    points.length ? `L ${points[0].x.toFixed(2)} ${(chartHeight - chartPadding).toFixed(2)}` : "",
    "Z",
  ]
    .filter(Boolean)
    .join(" ");

  const pathLength = points.reduce((length, point, index) => {
    if (index === 0) return 0;
    const prev = points[index - 1];

    return length + Math.hypot(point.x - prev.x, point.y - prev.y);
  }, 0);

  // Show only 3 grid lines: bottom (0), middle, and top (max)
  const gridLines = [
    {value: 0, y: chartHeight - chartPadding},
    {value: maxDownloads / 2, y: chartHeight - chartPadding - usableHeight * 0.5},
    {value: maxDownloads, y: chartPadding},
  ];

  const labelIndexes =
    history.length <= 3
      ? history.map((_, index) => index)
      : [0, Math.floor(history.length / 2), history.length - 1];

  const labels = labelIndexes.map((index) => {
    const point = history[index];

    return {
      day: point.day,
      text: formatDate(point.day),
    };
  });

  return {
    points,
    path: path || "",
    areaPath: areaPath || "",
    pathLength: pathLength || 1,
    gridLines,
    labels,
    maxDownloads,
  };
}

function formatDownloads(value: number) {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
  }).format(value);
}

function formatDate(day: string) {
  const date = new Date(`${day}T00:00:00.000Z`);
  if (Number.isNaN(date.getTime())) return day;

  // For monthly data, show month and year
  const month = date.toLocaleDateString("en-US", {month: "short"});
  const year = date.getFullYear();
  const dayNum = date.getDate();

  // If it's not the first day of month (partial month data), show the day too
  if (dayNum !== 1) {
    return `${month} ${dayNum}`;
  }

  // For regular monthly data, just show month abbreviation
  // Only show year for January or if space allows
  const currentYear = new Date().getFullYear();
  if (date.getMonth() === 0 || year !== currentYear) {
    return `${month} '${String(year).slice(-2)}`;
  }

  return month;
}
