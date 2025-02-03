![Plug banner](/plug.png)

`@terminally-online/plug` is the only everything aggregator for all onchain activity in the EVM ecosystem, providing a seamless interface between users and the decentralized world.

## Why Plug?

-   **Universal Integration**: Connect with every major protocol and platform in the EVM ecosystem.
-   **Intent-Driven Architecture**: Express what you want to achieve, let Plug handle the complexity.
-   **Maximum Value Extraction**: Automatically find and execute the most optimal routes for your transactions.
-   **Enterprise-Grade Reliability**: Built for scale with robust monitoring and fail-safes.

## Codebase Contents

```ml
├─ app - "Front-end application for end-users to interact with Plug."
├─ cdn - "Housing unit for static assets in Cloudflare."
├─ core - "The onchain logic for Plug that powers imperative and declarative intents."
├─ docs - "End-user focused documentation for Plug."
├─ licenses - "Automatic license generation and distribution for each package of Plug."
├─ pitch - "Automatic generation of pitch deck and supporting materials."
├─ posts - "Primitive CMS to manage post state on Plug website."
├─ science - "Singular housing location for all of the code-supported research of the ecosystem."
├─ solver — "Instant transaction and route building for intents within Plug."
└─ status — "Monitor the health of all the systems that power the Plug ecosystem."
```

For development everything is managed in this single monorepo. When you run `pnpm dev` everything is spun up and you have a fully functional app. To navigate easily through each you use my Arc [folder link here](https://arc.net/folder/671D8AF0-B946-4768-BDEC-AF9E1A3D53C4) and have everything setup for you nice and easy.

This folder exposes most links to you, but misses the backend specification that is as follows:

```ml
├─ App:
│  ├─ Port: 3000
│  ├─ Access: https://onplug.io
│  ├─ Websocket:
│  │   ├─ Port: 3001
│  │   └─ Access: https://streams.onplug.io
│  └─ Database:
│     ├─ Port: 5434
│     └─ Access: postgresql://postgres:postgres@localhost:5434/postgres
├─ CDN:
│  └─ Access: https://cdn.onplug.io
├─ Core:
│  └─ Access: @terminallyonline/plug-core
├─ Docs:
│  ├─ Port: 5173
│  └─ Access: https://docs.onplug.io
├─ Monitoring:
│  ├─ Port: 3004
│  ├─ Access: https://monitoring.onplug.io
│  ├─ Prometheus:
│  │  └─ Port:
│  │     ├─ 16686
│  │     └─ 14250
│  └─ Otel Collector:
│     └─ Port:
│        ├─ 4318
│        ├─ 13133
│        └─ 8889
├─ Solver:
│  ├─ Port: 8080
│  └─ Access: https://solver.onplug.io
└─ Status:
   ├─ Port: 3002
   └─ Access: https://status.onplug.io
```
