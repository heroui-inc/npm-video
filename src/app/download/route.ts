import type {AwsRegion} from "@remotion/lambda/client";

import {getRenderProgress} from "@remotion/lambda/client";
import {NextResponse} from "next/server";

import {__PROD__, env} from "@/lib/env";
import {limitDownloadRequest} from "@/lib/ratelimit";

export async function GET(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip =
    forwardedFor?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip")?.trim() ?? "unknown";
  const userAgent = req.headers.get("user-agent") ?? "unknown";
  const identifier = `${ip}:${userAgent}`;

  const rateLimit = await limitDownloadRequest(identifier, {
    ip,
    userAgent,
  });

  if (rateLimit && !rateLimit.success) {
    const retryAfterSeconds = Math.max(0, Math.ceil((rateLimit.reset - Date.now()) / 1000));
    const response = NextResponse.json(
      {error: "Too many download requests. Please wait and try again."},
      {status: 429},
    );
    response.headers.set("Retry-After", retryAfterSeconds.toString());
    response.headers.set("X-RateLimit-Limit", String(rateLimit.limit));
    response.headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateLimit.reset));

    return response;
  }

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
  if (__PROD__ && rateLimit) {
    headers.set("X-RateLimit-Limit", String(rateLimit.limit));
    headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
    headers.set("X-RateLimit-Reset", String(rateLimit.reset));
  }

  return new NextResponse(response.body, {headers});
}
