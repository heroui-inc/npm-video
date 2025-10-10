"use client";

import type {Props} from "@/video/schema";

import {Button} from "@heroui/button";
import {Spinner} from "@heroui/spinner";
import {readableColor} from "color2k";
import {useRouter} from "next/navigation";
import posthog from "posthog-js";
import {useState} from "react";

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
          color="primary"
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
      color="primary"
      spinner={<Spinner size="sm" color="current" />}
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
          setState({type: "started", renderId, bucketName});
          do {
            await delay(5000);
            const result = await getVideoGenerationProgress(renderId, bucketName);
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
            // eslint-disable-next-line no-constant-condition
          } while (true);
        } catch (err) {
          console.error(err);
          setState({type: "error"});
        }
      }}
      isLoading={state.type === "pending" || state.type === "started"}
      isDisabled={!inputProps || state.type === "pending" || state.type === "started"}
    >
      {state.type === "pending" || state.type === "started"
        ? "Generating video…"
        : "Export MP4 video"}
    </Button>
  );
}
