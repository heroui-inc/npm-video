import {env} from "@/lib/env";
import {AwsRegion, getRenderProgress} from "@remotion/lambda/client";
import {NextResponse} from "next/server";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url);
  const packageName = searchParams.get("packageName");
  const renderId = String(searchParams.get("renderId"));
  const bucketName = String(searchParams.get("bucketName"));

  const {outputFile} = await getRenderProgress({
    region: (env.REMOTION_AWS_REGION as AwsRegion) || "us-east-1",
    functionName: env.REMOTION_AWS_FUNCTION_NAME,
    renderId,
    bucketName,
  });

  if (!outputFile) throw new Error("Video is not ready for download");

  const response = await fetch(outputFile);
  const safeName =
    packageName
      ?.trim()
      .replace(/[\\/]+/g, "-")
      .replace(/\s+/g, "-") ?? "npm-package";

  const headers = new Headers(response.headers);
  headers.set("content-disposition", `attachment; filename="${safeName}.mp4"`);
  if (!headers.has("content-type")) {
    headers.set("content-type", "video/mp4");
  }

  return new NextResponse(response.body, {headers});
}
