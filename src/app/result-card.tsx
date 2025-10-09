import type {Props} from "@/video/schema";
import type {ReactNode} from "react";

import {GenerateButton} from "@/app/generate-button";

export function ResultCard({
  children,
  className,
  inputProps,
  primaryColor,
}: {
  children?: ReactNode;
  className?: string;
  inputProps?: Partial<Props>;
  primaryColor?: string;
}) {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex-1 w-full border border-white/10 rounded-xl mb-2">{children}</div>
      <GenerateButton inputProps={inputProps} primaryColor={primaryColor} />
    </div>
  );
}
