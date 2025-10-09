import {Composition} from "remotion";

import {
  NpmDownloadsComposition,
  animationDurationInSeconds,
  fps,
  height,
  width,
} from "./composition";
import {defaultProps, schema} from "./schema";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="NpmDownloads"
        component={NpmDownloadsComposition}
        fps={fps}
        width={width}
        height={height}
        durationInFrames={(animationDurationInSeconds + 1) * fps}
        defaultProps={defaultProps}
        schema={schema}
      />
    </>
  );
};
