"use client";

import {Button} from "@heroui/button";
import {Input} from "@heroui/input";
import {Popover, PopoverContent, PopoverTrigger} from "@heroui/popover";
import {Select, SelectItem} from "@heroui/select";
import {cn} from "@heroui/theme";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {useState} from "react";
import posthog from "posthog-js";
import {Iconify} from "@/components/iconify";

// Moved from actions since it doesn't need to be a server action
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

export const timeRanges = [
  {key: "7-days", label: "7 days"},
  {key: "30-days", label: "30 days"},
  {key: "90-days", label: "90 days"},
  {key: "6-months", label: "6 months"},
  {key: "1-year", label: "1 year"},
  {key: "2-years", label: "2 years"},
  {key: "5-years", label: "5 years"},
  {key: "all-time", label: "All time"},
];

export function PackageForm({
  initialPackage,
  initialTimeRange = "2-years",
  initialPrimaryColor = "#22c55e",
  initialSecondaryColor = "#10b981",
}: {
  initialPackage: string;
  initialTimeRange?: string;
  initialPrimaryColor?: string;
  initialSecondaryColor?: string;
}) {
  const router = useRouter();
  const [packageSpecifier, setPackageSpecifier] = useState(initialPackage);
  const [timeRange, setTimeRange] = useState(initialTimeRange);
  const [primaryColor, setPrimaryColor] = useState(initialPrimaryColor);
  const [secondaryColor, setSecondaryColor] = useState(initialSecondaryColor);

  return (
    <form
      className="flex flex-col gap-4 w-full"
      onSubmit={(event) => {
        event.preventDefault();
        const cleanPackage = normalizePackageSpecifier(packageSpecifier) ?? packageSpecifier.trim();
        if (!cleanPackage) {
          return;
        }

        setPackageSpecifier(cleanPackage);

        posthog.capture("package_submitted", {
          package: cleanPackage,
          timeRange,
        });

        const params = new URLSearchParams({
          package: cleanPackage,
          timeRange,
          primaryColor,
          secondaryColor,
        });
        router.push(`/?${params.toString()}`);
      }}
    >
      <div className="flex gap-2">
        <Input
          id="package"
          name="package"
          label="NPM package"
          placeholder="e.g. @heroui/react"
          className="text-[1rem] flex-1"
          classNames={{
            inputWrapper: "dark:bg-default-100/60",
          }}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          isRequired
          value={packageSpecifier}
          onValueChange={(value) => setPackageSpecifier(value)}
        />
        <Select
          label="Time range"
          className="max-w-[150px]"
          classNames={{
            trigger: "dark:bg-default-100/60",
          }}
          selectedKeys={[timeRange]}
          onSelectionChange={(keys) => setTimeRange(Array.from(keys)[0] as string)}
        >
          {timeRanges.map((range) => (
            <SelectItem key={range.key}>{range.label}</SelectItem>
          ))}
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex gap-2">
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button isIconOnly variant="bordered" aria-label="Color Palette">
                {primaryColor ? (
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white/20"
                    style={{backgroundColor: primaryColor}}
                  />
                ) : (
                  <Iconify icon="palette" className="w-5 h-5" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-4">
              <div className="flex flex-col gap-4">
                <div className="text-sm font-medium">Quick Colors</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    {primary: "#22c55e", secondary: "#10b981"},
                    {primary: "#3b82f6", secondary: "#2563eb"},
                    {primary: "#f97316", secondary: "#ea580c"},
                    {primary: "#a855f7", secondary: "#9333ea"},
                    {primary: "#DADADA", secondary: "#A1A1AA"},
                    {primary: "#eab308", secondary: "#ca8a04"},
                    {primary: "#06b6d4", secondary: "#0891b2"},
                    {primary: "#ec4899", secondary: "#db2777"},
                  ].map((colors, idx) => {
                    const isSelected =
                      primaryColor === colors.primary && secondaryColor === colors.secondary;

                    return (
                      <button
                        key={idx}
                        type="button"
                        data-selected={isSelected}
                        className={cn("w-12 h-12 rounded-lg transition-all cursor-pointer", {
                          "ring-2 ring-offset-2 ring-[var(--item-secondary-color)] ring-offset-content1":
                            isSelected,
                        })}
                        style={{
                          // @ts-ignore
                          "--item-primary-color": colors.primary,
                          // @ts-ignore
                          "--item-secondary-color": colors.secondary,
                        }}
                        onClick={() => {
                          setPrimaryColor(colors.primary);
                          setSecondaryColor(colors.secondary);
                        }}
                      >
                        <div
                          className="h-1/2 rounded-t-lg"
                          style={{backgroundColor: colors.primary}}
                        />
                        <div
                          className="h-1/2 rounded-b-lg"
                          style={{backgroundColor: colors.secondary}}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <Button variant="bordered" type="submit" className="flex-1">
          Submit
        </Button>
      </div>
      <div className="text-sm text-foreground-500 [&_a]:underline">
        Try{" "}
        <Link
          href="?package=heroui-native&timeRange=2-years"
          onClick={() => setPackageSpecifier("heroui-native")}
        >
          heroui-native
        </Link>{" "}
        or{" "}
        <Link
          href="?package=@heroui/react&timeRange=2-years"
          onClick={() => setPackageSpecifier("@heroui/react")}
        >
          @heroui/react
        </Link>
      </div>
    </form>
  );
}
