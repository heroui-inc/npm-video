"use client";
import type {Props} from "@/video/schema";
import type {PlayerRef} from "@remotion/player";

import useSize from "@react-hook/size";
import {Player} from "@remotion/player";
import {useEffect, useRef, useState} from "react";

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
  const playerRef = useRef<PlayerRef>(null);
  const [divWidth, divHeight] = useSize(divRef);
  const [isVisible, setIsVisible] = useState(true);

  // Pause video when tab is not visible to prevent memory accumulation
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      setIsVisible(visible);

      if (playerRef.current) {
        if (visible) {
          playerRef.current.play();
        } else {
          playerRef.current.pause();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Pause video when scrolled out of view
  useEffect(() => {
    if (!divRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (playerRef.current) {
            if (entry.isIntersecting && isVisible) {
              playerRef.current.play();
            } else {
              playerRef.current.pause();
            }
          }
        });
      },
      {threshold: 0.1},
    );

    observer.observe(divRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisible]);

  return (
    <div
      className="w-full h-full max-h-[380px] overflow-hidden aspect-video object-fit rounded-xl shadow-xl"
      ref={divRef}
    >
      {divWidth !== 0 && divHeight !== 0 && (
        <Player
          ref={playerRef}
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
