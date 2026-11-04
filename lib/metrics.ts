import {
  Counter,
  Histogram,
  Registry,
  collectDefaultMetrics,
} from "@prometheus-io/client";

type MetricsGlobal = typeof globalThis & {
  __metricsRegistry?: Registry;
};

const globalForMetrics = globalThis as MetricsGlobal;

export const registry = globalForMetrics.__metricsRegistry ?? new Registry();

if (!globalForMetrics.__metricsRegistry) {
  collectDefaultMetrics({ register: registry });
  globalForMetrics.__metricsRegistry = registry;
}

export const httpRequestsTotal =
  (registry.getSingleMetric("http_requests_total") as Counter<string> | undefined) ??
  new Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status"],
    registers: [registry],
  });

export const httpRequestDuration =
  (registry.getSingleMetric("http_request_duration_seconds") as
    | Histogram<string>
    | undefined) ??
  new Histogram({
    name: "http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: ["method", "route", "status"],
    buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    registers: [registry],
  });
