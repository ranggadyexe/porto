import { connection } from "next/server";
import { registry } from "@/lib/metrics";

export async function GET(request: Request) {
  await connection();

  const token = process.env.METRICS_TOKEN;

  if (!token || request.headers.get("authorization") !== `Bearer ${token}`) {
    return new Response("Not Found", { status: 404 });
  }

  return new Response(await registry.metrics(), {
    headers: {
      "Content-Type": registry.contentType,
      "Cache-Control": "no-store",
    },
  });
}
