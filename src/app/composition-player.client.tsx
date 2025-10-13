"use client";
import type {Props} from "@/video/schema";
import {CompositionPlayer} from "@/app/composition-player";

export default function CompositionPlayerClient({inputProps}: {inputProps: Partial<Props>}) {
  return <CompositionPlayer inputProps={inputProps} />;
}


