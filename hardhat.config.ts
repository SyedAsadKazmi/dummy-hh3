import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import hardhatVerifyPlugin from "@nomicfoundation/hardhat-verify";

import { deploy } from "./tasks/index.js";
import { deployCounter } from "./tasks/deployCounter.js";

import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin, hardhatVerifyPlugin],
  tasks: [deploy, deployCounter],
  solidity: {
    npmFilesToBuild: [
      "@openzeppelin/contracts/governance/TimelockController.sol"
    ],
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [process.env.ACCOUNT_PRIVATE_KEY || ""],
    },
    avalancheFuji: {
      type: "http",
      chainType: "l1",
      url: process.env.AVALANCHE_FUJI_RPC_URL || "",
      accounts: [process.env.ACCOUNT_PRIVATE_KEY || ""],
    },
  },
  verify: {
    etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY || "",
      enabled: true,
    }
  },
};

export default config;
