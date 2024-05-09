## Fungi Agent

### Overview
The Fungi Agent is a decentralized finance (DeFi) interface powered by a Large Language Model (LLM). It utilizes a Smart Contract Account (SCA) to perform transactions on behalf of users. This agent is enhanced with tools that allow it to access on-chain transaction data, consult real-time pricing, and fetch general information from the internet.

### Features
- **Smart Contract Account Management:** Utilizes Alchemy's Smart Contract Account Kit and MagicLink's wallet-as-a-service with social login capabilities.
- **Real-time Data Access:** Provides real-time access to market prices and transactional data.
- **Interactive Chat Interface:** Features a chat-based user interface for interaction with the agent.
- **Insightful Side Panel:** Displays portfolio composition, transaction history, and current balances.

### Screenshots
![Fungi Agent](public/readme/FungiAgentSS0.png?raw=true "Fungi Agent Interface")
![Fungi Agent Transaction](public/readme/FungiAgentSS1.png?raw=true "Transaction History")
![Fungi Agent Balance](public/readme/FungiAgentSS2.png?raw=true "Portfolio Balance")

### Architecture Diagram
![Fungi Agent Architecture](public/readme/FungiAgentDiagram.png?raw=true "System Architecture")

### Prerequisites
Before starting, ensure you have the following installed:
- Node.js (v12.0 or newer)
- A package manager: npm, yarn, pnpm, or bun

### Getting Started
To get the application running locally:

1. Clone the repository:
   ```bash
   git clone https://yourrepository.com/FungiAgent.git
   cd FungiAgent
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Development
- **Modify Pages:** Start editing by modifying `pages/index.tsx`. The page auto-updates as you make changes.
- **API Routes:** Explore API routes by visiting [http://localhost:3000/api/hello](http://localhost:3000/api/hello). Modify or add new endpoints in the `pages/api` directory.

### Contributing
Contributions are welcome! For major changes, please open an issue first to discuss what you would like to change. Ensure to update tests as appropriate.

### License
Distributed under the MIT License. See `LICENSE` for more information.
