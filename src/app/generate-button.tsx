"use client";

import type {Props} from "@/video/schema";

import {Button, Spinner} from "@heroui/react";
import {readableColor} from "color2k";
import {useRouter} from "next/navigation";
import posthog from "posthog-js";
import {useEffect, useRef, useState} from "react";

import {generateVideo, getVideoGenerationProgress} from "@/app/actions";
import {delay} from "@/lib/utils";

type State =
  | {type: "initial"}
  | {type: "pending"}
  | {type: "started"; renderId: string; bucketName: string}
  | {type: "done"; renderId: string; bucketName: string}
  | {type: "error"};

export function GenerateButton({
  inputProps,
  primaryColor,
}: {
  inputProps?: Partial<Props>;
  primaryColor?: string;
}) {
  const [state, setState] = useState<State>({type: "initial"});
  const router = useRouter();
  const isCancelledRef = useRef(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isCancelledRef.current = true;
    };
  }, []);

  const isPending = state.type === "pending" || state.type === "started";

  if (inputProps && state.type === "done") {
    const packageName = inputProps.packageName ?? inputProps.displayName ?? "package";

    return (
      <form
        action="/download"
        method="GET"
        className="w-full"
        onSubmit={() => {
          posthog.capture("video_downloaded", {
            package: packageName,
            renderId: state.renderId,
          });
        }}
      >
        <input type="hidden" name="renderId" value={state.renderId} />
        <input type="hidden" name="bucketName" value={state.bucketName} />
        <input type="hidden" name="packageName" value={packageName} />
        <Button
          type="submit"
          className="font-medium w-full"
          style={
            primaryColor
              ? {
                  backgroundColor: primaryColor,
                  color: readableColor(primaryColor),
                }
              : undefined
          }
        >
          Download video
        </Button>
      </form>
    );
  }

  return (
    <Button
      className="font-medium"
      style={
        primaryColor
          ? {
              backgroundColor: primaryColor,
              color: readableColor(primaryColor),
            }
          : undefined
      }
      onPress={async () => {
        try {
          if (!inputProps) return;

          const packageName = inputProps.packageName ?? inputProps.displayName ?? "npm-package";

          posthog.capture("video_generation_started", {
            package: packageName,
          });

          setState({type: "pending"});
          const {renderId, bucketName} = await generateVideo(inputProps);

          // Check if component was unmounted during the async operation
          if (isCancelledRef.current) return;

          setState({type: "started", renderId, bucketName});

          // Poll for completion with cancellation support
          while (!isCancelledRef.current) {
            await delay(5000);

            // Check again after delay
            if (isCancelledRef.current) return;

            const result = await getVideoGenerationProgress(renderId, bucketName);

            // Check again after async operation
            if (isCancelledRef.current) return;

            if (result.done) {
              posthog.capture("video_generation_completed", {
                package: packageName,
                renderId,
              });
              setState({type: "done", renderId, bucketName});
              posthog.capture("video_downloaded", {
                package: packageName,
                renderId,
              });
              router.push(
                `/download?renderId=${renderId}&bucketName=${bucketName}&packageName=${encodeURIComponent(
                  packageName,
                )}`,
              );
              break;
            }
            if (result.error) {
              posthog.capture("video_generation_failed", {
                package: packageName,
                renderId,
              });
              setState({type: "error"});
              break;
            }
          }
        } catch (err) {
          console.error(err);
          if (!isCancelledRef.current) {
            setState({type: "error"});
          }
        }
      }}
      isPending={isPending}
      isDisabled={!inputProps || isPending}
    >
      {({isPending: buttonPending}) => (
        <>
          {buttonPending ? <Spinner color="current" size="sm" /> : null}
          {isPending ? "Generating video…" : "Export MP4 video"}
        </>
      )}
    </Button>
  );
}
