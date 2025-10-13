# Hardhat 3 Artifact Generation Issue Demo

This repository demonstrates a critical issue in Hardhat 3 where artifacts are not automatically generated for imported OpenZeppelin contracts during compilation, specifically for the `TimelockController` contract.

## Issue Description

When using Hardhat 3 with OpenZeppelin contracts, the compilation process fails to generate artifacts for imported contracts that are not directly present in the `contracts/` directory. This causes deployment tasks to fail with the error:

```
Error HHE1000: Artifact for contract "TimelockController" not found.
```

## Prerequisites

- **Node.js**: v22 or higher (recommended)
- **npm**: Latest version

## Installation

1. Clone this repository:
```bash
git clone https://github.com/SyedAsadKazmi/dummy-hh3
cd dummy-hh3
```

2. Install dependencies:
```bash
npm install
```

## Reproducing the Issue

### Step 1: Compile the Project

```bash
npx hardhat compile
```

Expected: All contracts should compile successfully, including generating artifacts for imported OpenZeppelin contracts.

**Result**: Compilation succeeds, but only generates artifacts for contracts in the `contracts/` directory, not for imported contracts like `TimelockController`.

### Step 2: Attempt Deployment

Replace `YOUR_ADMIN_ADDRESS` with your desired admin address:

```bash
npx hardhat deploy --admin YOUR_ADMIN_ADDRESS
```

**Example:**
```bash
npx hardhat deploy --admin 0xA028Cedc47485aB2F1230551E4f3a6871B764263
```

### Expected vs Actual Result

**Expected Output:**
```
🚀 Deploying TimelockController...
Parameters:
  Min Delay: 3600 seconds
  Proposers: None
  Executors: None
  Admin: 0xA028Cedc47485aB2F1230551E4f3a6871B764263
📝 Deployment tx hash: 0x...
✅ TimelockController deployed at: 0x...
```

**Actual Output:**
```
🚀 Deploying TimelockController...
Parameters:
  Min Delay: 3600 seconds
  Proposers: None
  Executors: None
  Admin: 0xA028Cedc47485aB2F1230551E4f3a6871B764263
Error HHE1000: Artifact for contract "TimelockController" not found. 

For more info go to https://hardhat.org/HHE1000 or run Hardhat with --show-stack-traces
```

## Project Structure

```
dummy-hh3/
├── contracts/
│   ├── Counter.sol          # Local contract (artifact generated ✅)
│   ├── Counter.t.sol        # Test contract
│   └── Dummy.sol           # Local contract (artifact generated ✅)
├── tasks/
│   └── index.ts            # Deployment task attempting to use TimelockController
├── hardhat.config.ts       # Hardhat configuration
├── package.json
└── README.md
```

## Root Cause

The issue occurs because Hardhat 3's compilation process:

1. ✅ Successfully compiles and generates artifacts for contracts in the `contracts/` directory
2. ❌ Does NOT automatically generate artifacts for imported OpenZeppelin contracts (like `TimelockController`)
3. ❌ The deployment task fails when trying to access the missing `TimelockController` artifact

## Task Configuration

The deployment task in `tasks/index.ts` attempts to deploy a `TimelockController` with the following parameters:

- **minDelay**: Minimum delay for timelock operations (default: 3600 seconds)
- **proposers**: Array of addresses that can propose operations (default: empty array)
- **executors**: Array of addresses that can execute operations (default: empty array)  
- **admin**: Address that will have admin privileges (required parameter)

## Technical Details

### Hardhat Configuration

The project uses:
- Hardhat Toolbox Viem plugin
- Solidity 0.8.28
- Multiple network configurations (hardhatMainnet, hardhatOp, sepolia)

### Contract Dependencies

The task attempts to deploy:
- `@openzeppelin/contracts/governance/TimelockController.sol`

But Hardhat 3 compilation doesn't generate artifacts for this imported contract.

## Workaround

Currently, there's no straightforward workaround within Hardhat 3's standard workflow. Potential solutions being investigated:

1. Manually copying OpenZeppelin contracts to the `contracts/` directory
2. Using custom compilation scripts
3. Reverting to Hardhat 2.x (not ideal)
4. Waiting for official Hardhat 3 fixes

## Environment

- **Hardhat**: 3.x
- **Node.js**: v22+
- **OpenZeppelin Contracts**: Latest
- **Viem**: Latest (via Hardhat Toolbox Viem)

## Related Links

- [Hardhat Error HHE1000 Documentation](https://hardhat.org/HHE1000)
- [Hardhat 3 Migration Guide](https://hardhat.org/migrate-from-hardhat2)
- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)

## Contributing

If you have found a solution or workaround for this issue, please feel free to open a pull request or issue.

---

**Note**: This issue significantly impacts projects that rely on OpenZeppelin contracts and showcases a critical limitation in Hardhat 3's current implementation.
