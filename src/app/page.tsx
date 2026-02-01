import {Suspense} from "react";

import {getNpmDownloadsInfo} from "@/app/actions";
import {CompositionPlayer} from "@/app/composition-player";
import {ErrorCard} from "@/app/error-card";
import {PackageForm} from "@/app/package-form";
import {ResultCard} from "@/app/result-card";
import {LoadingSpinner} from "@/components/loading-spinner";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    package?: string;
    timeRange?: string;
    primaryColor?: string;
    secondaryColor?: string;
  }>;
}) {
  const params = await searchParams;
  const packageName = params.package ?? "@heroui/react";
  const timeRange = params.timeRange ?? "2-years";
  const primaryColor = params.primaryColor ?? "#22c55e";
  const secondaryColor = params.secondaryColor ?? "#10b981";

  return (
    <div className="container mx-auto w-full max-w-2xl flex flex-col gap-8 h-full">
      <PackageForm
        initialPackage={packageName}
        initialTimeRange={timeRange}
        initialPrimaryColor={primaryColor}
        initialSecondaryColor={secondaryColor}
      />
      <div className="flex-1 min-h-0">
        <Suspense
          key={`${packageName}-${timeRange}-${primaryColor}-${secondaryColor}`}
          fallback={<LoadingSpinner />}
        >
          <PackageResult
            packageName={packageName}
            timeRange={timeRange}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </Suspense>
      </div>
    </div>
  );
}

async function PackageResult({
  packageName,
  timeRange,
  primaryColor,
  secondaryColor,
}: {
  packageName: string;
  timeRange: string;
  primaryColor: string;
  secondaryColor: string;
}) {
  const inputProps = await getNpmDownloadsInfo(packageName, timeRange);

  return (
    <div className="h-full">
      {inputProps === null ? (
        <ErrorCard packageName={packageName} />
      ) : (
        <ResultCard
          className="relative"
          inputProps={{
            ...inputProps,
            primaryColor,
            secondaryColor,
          }}
          primaryColor={primaryColor}
        >
          <CompositionPlayer
            inputProps={{
              ...inputProps,
              primaryColor,
              secondaryColor,
            }}
          />
        </ResultCard>
      )}
    </div>
  );
}
