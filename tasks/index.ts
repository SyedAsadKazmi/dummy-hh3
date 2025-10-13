import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types/hre";
import { isAddress } from "viem";

export const deploy = task(
    "deploy",
    "Deploys a TimelockController contract"
)
    .addOption({
        name: "minDelay",
        description: "The minimum delay for the timelock",
        defaultValue: "3600",
    })
    .addOption({
        name: "proposers",
        description: "The proposers for the timelock",
        defaultValue: "[]",
    })
    .addOption({
        name: "executors",
        description: "The executors for the timelock",
        defaultValue: "[]",
    })
    .addOption({
        name: "admin",
        description: "The admin for the timelock",
        defaultValue: "0x0000000000000000000000000000000000000000",
    })
    .setAction(async () => ({
        default: async (
            {
                minDelay = "3600",
                proposers = "[]",
                executors = "[]",
                admin = "0x0000000000000000000000000000000000000000"
            }: {
                minDelay?: string;
                proposers?: string;
                executors?: string;
                admin?: string;
            },
            hre: HardhatRuntimeEnvironment
        ) => {
            console.log("🚀 Deploying TimelockController...");
            const { viem } = await hre.network.connect();
            const publicClient = await viem.getPublicClient();
            
            // Parse proposers and executors arrays from strings
            const proposersArray = proposers === "[]" ? [] : JSON.parse(proposers);
            const executorsArray = executors === "[]" ? [] : JSON.parse(executors);
            
            // Validate addresses
            if (admin !== "0x0000000000000000000000000000000000000000" && !isAddress(admin)) {
                throw new Error(`Invalid admin address: ${admin}`);
            }
            
            console.log(`Parameters:`);
            console.log(`Min Delay: ${minDelay} seconds`);
            console.log(`Proposers: ${proposersArray.length > 0 ? proposersArray.join(', ') : 'None'}`);
            console.log(`Executors: ${executorsArray.length > 0 ? executorsArray.join(', ') : 'None'}`);
            console.log(`Admin: ${admin}`);
            
            const { contract, deploymentTransaction } = await viem.sendDeploymentTransaction("TimelockController", [
                BigInt(minDelay),
                proposersArray,
                executorsArray,
                admin
            ]);
            
            console.log(`📝 Deployment tx hash: ${deploymentTransaction.hash}`);
            await publicClient.waitForTransactionReceipt({ hash: deploymentTransaction.hash });
            console.log(`✅ TimelockController deployed at: ${contract.address}`);
        },
    })).build();




