"use client";
import type {Props} from "@/video/schema";

import useSize from "@react-hook/size";
import {Player} from "@remotion/player";
import {useRef} from "react";

import {
  NpmDownloadsComposition,
  animationDurationInSeconds,
  fps,
  height,
  width,
} from "@/video/composition";
import {defaultProps} from "@/video/schema";

export function CompositionPlayer({inputProps}: {inputProps: Partial<Props>}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [divWidth, divHeight] = useSize(divRef);

  return (
    <div
      className="w-full h-full max-h-[380px] overflow-hidden aspect-video object-fit rounded-xl shadow-xl"
      ref={divRef}
    >
      {divWidth !== 0 && divHeight !== 0 && (
        <Player
          style={{width: "100%", height: "100%"}}
          component={NpmDownloadsComposition}
          compositionWidth={width}
          compositionHeight={height}
          fps={fps}
          durationInFrames={(animationDurationInSeconds + 1) * fps}
          inputProps={{...defaultProps, ...inputProps}}
          controls
          loop
          showVolumeControls={false}
          allowFullscreen={false}
          autoPlay
        />
      )}
    </div>
  );
}
