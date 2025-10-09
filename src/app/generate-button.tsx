"use client";

import type {Props} from "@/video/schema";

import {Button} from "@heroui/button";
import {readableColor} from "color2k";
import {useRouter} from "next/navigation";
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
      <form action="/download" method="GET">
        <input type="hidden" name="renderId" value={state.renderId} />
        <input type="hidden" name="bucketName" value={state.bucketName} />
        <input type="hidden" name="packageName" value={packageName} />
        <Button
          type="submit"
          color="primary"
          className="font-medium"
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

          setState({type: "pending"});
          const {renderId, bucketName} = await generateVideo(inputProps);
          setState({type: "started", renderId, bucketName});
          do {
            await delay(5000);
            const result = await getVideoGenerationProgress(renderId, bucketName);
            if (result.done) {
              setState({type: "done", renderId, bucketName});
              const packageName = inputProps.packageName ?? inputProps.displayName ?? "npm-package";
              router.push(
                `/download?renderId=${renderId}&bucketName=${bucketName}&packageName=${encodeURIComponent(
                  packageName,
                )}`,
              );
              break;
            }
            if (result.error) {
              setState({type: "error"});
              break;
            }
          } while (true);
        } catch (err) {
          console.error(err);
          setState({type: "error"});
        }
      }}
      isDisabled={!inputProps || state.type === "pending" || state.type === "started"}
    >
      {state.type === "pending" || state.type === "started"
        ? "Generating video…"
        : "Export MP4 video"}
    </Button>
  );
}
