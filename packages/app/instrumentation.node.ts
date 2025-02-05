import { config as dotenvConfig } from 'dotenv'
import { resolve } from 'path'
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus'
import { HostMetrics } from '@opentelemetry/host-metrics'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http'
import { RuntimeNodeInstrumentation } from '@opentelemetry/instrumentation-runtime-node'
import {
  Resource,
  detectResourcesSync,
  envDetector,
  hostDetector,
  processDetector,
} from '@opentelemetry/resources'
import { MeterProvider } from '@opentelemetry/sdk-metrics'

dotenvConfig({ path: resolve(process.cwd(), '.env') })

const exporter = new PrometheusExporter({
  port: 9464,
  endpoint: '/metrics',
  host: '0.0.0.0',
})

const detectedResources = detectResourcesSync({
  detectors: [envDetector, processDetector, hostDetector],
})

const customResources = new Resource({})

const resources = detectedResources.merge(customResources)

const meterProvider = new MeterProvider({
  readers: [exporter],
  resource: resources,
})

const hostMetrics = new HostMetrics({
  name: `otel-metrics`,
  meterProvider,
})

registerInstrumentations({
  meterProvider,
  instrumentations: [new HttpInstrumentation(), new RuntimeNodeInstrumentation()],
})

hostMetrics.start()

