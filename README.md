# 🔌 Plug App

> [!NOTE]
> This repository is a submodule of the larger [Plug monorepo](https://github.com/nftchance/plug) that contains all the required pieces to run the entire Plug stack yourself.

The application of Plug powers the front-end user interface that enables the capability of building complex declarative EVM transactions (intents) in a trustless node-based editor.

The key functionality is powered by the following packages (each have their own function):

```ml
services
├─ authentication — "NextAuth & SIWE"
├─ client — "TRPC"
├─ database — "Docker & PostgreSQL & Prisma"
├─ ethereum — "Viem & Wagmi & WalletConnect"
├─ server — "API backend that powers the server, client interface and sdk when needed."
├─ style — "Tailwind"
└─ web — "Next"
```

## Dependencies

In order to run `@nftchance/plug-app` is it necessary to install all the following dependencies first:

```ml
├─ docker — "Pipeline to run containerized code processes."
└─ pnpm — "Efficient package manager for Node modules."
```

## Getting Started

To run an instance of `@nftchance/plug-app` is incredibly straightforward. Open your terminal and run:

```bash
pnpm i
pnpm dev
```

> [!TIP]
> You will need a PostgreSQL database running in order to read and save the data of your application.
>
> By default, the app will try running a database through Docker. If it fails however, the build will proceed.
>
> For local development, spin one up using your preferred method, such as Docker. Again, an attempt is made
> automatically. If you would like to use your own, update the `dev:db` script in `package.json`.
> For production development, it cannot be on the edge due to the use of Prisma.
