"use client";

import {Spinner} from "@heroui/react";

export function LoadingSpinner() {
  return (
    <div className="w-full h-full min-h-[200px] flex items-center justify-center">
      <Spinner />
    </div>
  );
}
