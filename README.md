## Fungi Agent

The Fungi Agent is an LLM based agent that has connections to a Smart Contract Account (SCA) that allows it to perform transactions on behalf of the user. A number of tools are also provided to the agent to improve its performance and capacity to operate in the DeFi space, such as access to on-chain transactional data, consult prices in real time, and search the internet for general information fetching.

The SCA used by the agent is created with Alchemy's Smart Contract Account Kit, and MagicLink's wallet-as-a-service to create the SCA with social login.

This web app features a chat component as the main interface for the agent, and a sidepanel to inspect the state of the SCA, such as the portfolio composition, the transaction history, and the current balance.

![Alt text](public/readme/FungiAgentSS0.png?raw=true "Fungi Agent")

![Alt text](public/readme/FungiAgentSS1.png?raw=true "Fungi Agent")

![Alt text](public/readme/FungiAgentSS2.png?raw=true "Fungi Agent")

The following diagram shows in a broad way the architecture of the Fungi Agent:

![Alt text](public/readme/FungiAgentDiagram.png?raw=true "Fungi Agent Diagram")



This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.


