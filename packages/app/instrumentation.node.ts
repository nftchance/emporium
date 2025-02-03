import { ClientRequest, IncomingMessage, ServerResponse } from "http"

import { metrics } from "@opentelemetry/api"
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http"
import { Resource } from "@opentelemetry/resources"
import { MeterProvider, PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics"
import { NodeSDK } from "@opentelemetry/sdk-node"
import { SimpleSpanProcessor } from "@opentelemetry/sdk-trace-node"
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions"

// Create a resource that identifies our service
const resource = new Resource({
	[SemanticResourceAttributes.SERVICE_NAME]: "next-app",
	[SemanticResourceAttributes.SERVICE_VERSION]: "1.0.0",
	[SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: "development"
})

// Configure metrics
const metricExporter = new OTLPMetricExporter({
	url: "http://localhost:4319/v1/metrics",
	headers: {
		"Content-Type": "application/json"
	}
})

const meterProvider = new MeterProvider({
	resource: resource
})

meterProvider.addMetricReader(
	new PeriodicExportingMetricReader({
		exporter: metricExporter,
		exportIntervalMillis: 1000
	})
)

// Set the global MeterProvider
metrics.setGlobalMeterProvider(meterProvider)

// Create meters for different metric categories
const meter = metrics.getMeter("next-app")

// System metrics
const memoryUsageGauge = meter.createObservableGauge("process_memory_bytes", {
	description: "Process memory usage in bytes",
	unit: "bytes"
})

memoryUsageGauge.addCallback(result => {
	const used = process.memoryUsage()
	result.observe(used.heapUsed, { type: "heap_used" })
	result.observe(used.heapTotal, { type: "heap_total" })
	result.observe(used.rss, { type: "rss" })
})

// Resource Utilization
const cpuUsageGauge = meter.createObservableGauge("system.cpu.usage", {
	description: "CPU usage percentage",
	unit: "percent"
})

const diskUsageGauge = meter.createObservableGauge("system.disk.usage", {
	description: "Disk usage metrics",
	unit: "bytes"
})

// Network Metrics
const networkIOHistogram = meter.createHistogram("system.network.io", {
	description: "Network IO metrics",
	unit: "bytes"
})

// Cache Performance
const cacheHitRatio = meter.createHistogram("cache.hit_ratio", {
	description: "Cache hit/miss ratio",
	unit: "ratio"
})

// Event loop metrics
let lastLoopTime = process.hrtime.bigint()
const eventLoopLagHistogram = meter.createHistogram("nodejs_eventloop_lag_seconds", {
	description: "Event loop lag in seconds",
	unit: "s"
})

setInterval(() => {
	const now = process.hrtime.bigint()
	const delta = Number(now - lastLoopTime) / 1_000_000_000 // Convert to seconds
	eventLoopLagHistogram.record(delta)
	lastLoopTime = now
}, 1000)

// Next.js specific metrics
const pageRenderHistogram = meter.createHistogram("nextjs_page_render_duration_seconds", {
	description: "Page render duration in seconds",
	unit: "s"
})

const apiRouteHistogram = meter.createHistogram("nextjs_api_duration_seconds", {
	description: "API route duration in seconds",
	unit: "s"
})

const staticGenerationHistogram = meter.createHistogram("nextjs_static_generation_duration_seconds", {
	description: "Static generation duration in seconds",
	unit: "s"
})

const navigationHistogram = meter.createHistogram("nextjs_navigation_duration_seconds", {
	description: "Client-side navigation duration in seconds",
	unit: "s"
})

// User Experience Metrics
const timeToFirstByteHistogram = meter.createHistogram("http.ttfb", {
	description: "Time to First Byte",
	unit: "ms"
})

const largestContentfulPaintHistogram = meter.createHistogram("web.lcp", {
	description: "Largest Contentful Paint",
	unit: "ms"
})

// Client-side performance metrics
const clientMetrics = meter.createHistogram("nextjs_client_performance_seconds", {
	description: "Client-side performance metrics in seconds",
	unit: "s"
})

// First Contentful Paint (FCP)
const fcpHistogram = meter.createHistogram("nextjs_fcp_seconds", {
	description: "First Contentful Paint in seconds",
	unit: "s"
})

// Time to Interactive (TTI)
const ttiHistogram = meter.createHistogram("nextjs_tti_seconds", {
	description: "Time to Interactive in seconds",
	unit: "s"
})

// Add route change monitoring
const routeChangeHistogram = meter.createHistogram("nextjs_route_change_seconds", {
	description: "Client-side route change duration in seconds",
	unit: "s"
})

// Database metrics
const dbQueryHistogram = meter.createHistogram("prisma_query_duration_seconds", {
	description: "Database query duration in seconds",
	unit: "s"
})

// Database Connection Pool
const dbConnectionPoolGauge = meter.createObservableGauge("db.connections.pool", {
	description: "Database connection pool metrics"
})

// Query Performance
const slowQueriesCounter = meter.createCounter("db.slow_queries", {
	description: "Slow query counts"
})

// Solver metrics
const solverLatencyHistogram = meter.createHistogram("solver_execution_duration_seconds", {
	description: "Solver execution duration in seconds",
	unit: "s"
})

const solverQueueGauge = meter.createObservableGauge("solver_queue_size", {
	description: "Number of jobs in solver queue",
	unit: "jobs"
})

const simulationSuccessRate = meter.createHistogram("solver.success_rate", {
	description: "Simulation success/failure ratio",
	unit: "ratio"
})

// Business Metrics
const activeUsersGauge = meter.createObservableGauge("business.active_users", {
	description: "Currently active users",
	unit: "users"
})

// Security Metrics
const authFailuresCounter = meter.createCounter("security.auth_failures", {
	description: "Authentication failures"
})

const rateLimit = meter.createCounter("security.rate_limits", {
	description: "Rate limit hits"
})

// Dependencies Health
const externalApiLatency = meter.createHistogram("external.api.latency", {
	description: "External API call latency",
	unit: "ms"
})

// WebSocket Metrics
const websocketConnectionsGauge = meter.createObservableGauge("websocket.connections", {
	description: "Active WebSocket connections"
})

const websocketMessageRate = meter.createHistogram("websocket.message_rate", {
	description: "WebSocket messages per second",
	unit: "messages/s"
})

// Memory Leaks Detection
const memoryLeakGauge = meter.createObservableGauge("memory.heap.growth", {
	description: "Heap memory growth rate",
	unit: "bytes/s"
})

// Error tracking
const errorCounter = meter.createCounter("app_errors_total", {
	description: "Total number of application errors"
})

// Configure tracing
const sdk = new NodeSDK({
	resource: resource,
	spanProcessor: new SimpleSpanProcessor(
		new OTLPTraceExporter({
			url: "http://localhost:4319/v1/traces",
			headers: {
				"jaeger-service-name": "next-app"
			}
		})
	),
	instrumentations: [
		new HttpInstrumentation({
			requestHook: (span, request: IncomingMessage | ClientRequest) => {
				if (request instanceof IncomingMessage) {
					const url = request.url || ""
					const method = request.method || "unknown"
					span.setAttribute("http.request.method", method)

					// Track different types of routes
					if (url.startsWith("/api/")) {
						span.setAttribute("nextjs.route.type", "api")
						const startTime = process.hrtime.bigint()

						const originalEnd = (request.socket as any)?._httpMessage?.end
						if (originalEnd) {
							;(request.socket as any)._httpMessage.end = function (...args: any[]) {
								const duration = Number(process.hrtime.bigint() - startTime) / 1_000_000_000 // Convert to seconds
								apiRouteHistogram.record(duration, {
									method,
									route: url
								})
								return originalEnd.apply(this, args)
							}
						}
					} else {
						const isDataRequest = request.headers.accept?.includes("application/json")
						span.setAttribute("nextjs.route.type", isDataRequest ? "data" : "page")

						if (!isDataRequest) {
							const startTime = process.hrtime.bigint()
							const originalEnd = (request.socket as any)?._httpMessage?.end
							if (originalEnd) {
								;(request.socket as any)._httpMessage.end = function (...args: any[]) {
									const duration = Number(process.hrtime.bigint() - startTime) / 1_000_000_000 // Convert to seconds
									pageRenderHistogram.record(duration, {
										route: url
									})
									return originalEnd.apply(this, args)
								}
							}
						}
					}

					// Record client-side metrics if they're present in headers
					const clientTiming = request.headers["x-client-timing"]
					if (clientTiming) {
						try {
							const timing = JSON.parse(clientTiming as string)
							if (timing.fcp) fcpHistogram.record(timing.fcp)
							if (timing.tti) ttiHistogram.record(timing.tti)
							if (timing.routeChange) routeChangeHistogram.record(timing.routeChange)
						} catch (e) {
							console.error("Failed to parse client timing:", e)
						}
					}
				}
			},
			responseHook: (span, response: IncomingMessage | ServerResponse) => {
				if ("statusCode" in response) {
					const statusCode = response.statusCode || 500
					span.setAttribute("http.response.status_code", statusCode)

					// Track errors
					if (statusCode >= 400) {
						errorCounter.add(1, {
							status_code: statusCode.toString()
						})
					}
				}
			}
		})
	]
})

// Implementation examples for observable metrics
cpuUsageGauge.addCallback(result => {
	const cpuUsage = process.cpuUsage()
	result.observe((cpuUsage.user + cpuUsage.system) / 1000000) // Convert to seconds
})

let currentConnections = 0
let idleConnections = 0
dbConnectionPoolGauge.addCallback(result => {
	result.observe(currentConnections, { state: "active" })
	result.observe(idleConnections, { state: "idle" })
})

// Track solver queue size
let currentQueueSize = 0
solverQueueGauge.addCallback(result => {
	result.observe(currentQueueSize)
})

// Export functions to record metrics from other parts of the application
export const recordSolverExecution = (duration: number) => {
	solverLatencyHistogram.record(duration)
}

export const updateSolverQueueSize = (size: number) => {
	currentQueueSize = size
}

export const recordDbQuery = (duration: number, query: string) => {
	dbQueryHistogram.record(duration, {
		query_type: query
	})
}

export const recordError = (type: string, message: string) => {
	errorCounter.add(1, {
		error_type: type,
		message
	})
}

export const recordWebSocketMessage = () => {
	websocketMessageRate.record(1)
}

export const recordSlowQuery = (queryType: string) => {
	slowQueriesCounter.add(1, { type: queryType })
}

export const recordAuthFailure = (reason: string) => {
	authFailuresCounter.add(1, { reason })
}

// Handle process shutdown
const shutdownHandler = async () => {
	try {
		await sdk.shutdown()
		await meterProvider.shutdown()
		console.log("Telemetry SDK shut down successfully")
	} catch (err) {
		console.error("Error shutting down Telemetry SDK:", err)
		process.exit(1)
	}
}

process.on("SIGTERM", shutdownHandler)
process.on("SIGINT", shutdownHandler)

// Start the SDK
try {
	await sdk.start()
	console.log("Telemetry started successfully")
} catch (err) {
	console.error("Failed to start Telemetry:", err)
}
