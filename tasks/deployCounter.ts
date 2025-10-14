import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types/hre";

export const deployCounter = task(
    "deployCounter",
    "Deploys a simple Counter contract"
).addPositionalArgument({
    name: "initialValue",
    description: "The initial value for the Counter",
    defaultValue: "0", // CLI args are strings
})
    .addFlag({
        name: "verifycontract",
        description: "Verify the contract on Etherscan",
    })
    .setAction(

        async () => ({
            default: async (
                { initialValue, verifycontract = false }: { initialValue: string; verifycontract: boolean },
                hre: HardhatRuntimeEnvironment
            ) => {
                console.log("🚀 Deploying Counter...");
                const { viem } = await hre.network.connect();
                const publicClient = await viem.getPublicClient();
                console.log(await publicClient.getBlockNumber());
                console.log(`🧾 Deploying Counter with initial value ${initialValue}...`);
                const { contract, deploymentTransaction } = await viem.sendDeploymentTransaction("Counter", [BigInt(initialValue)]);
                console.log(`📝 Deployment tx hash: ${deploymentTransaction.hash}`);
                await publicClient.waitForTransactionReceipt({ hash: deploymentTransaction.hash, confirmations: 3 });
                console.log(`✅ Counter deployed at: ${contract.address}`);

                // ✅ Verify contract if requested
                if (verifycontract) {
                    console.info("Verifying contract on Etherscan...");

                    try {
                        const verifyTask = hre.tasks.getTask(["verify", "etherscan"]);
                        await verifyTask.run({
                            address: contract.address,
                            constructorArgs: [initialValue], // Positional arg as array
                        });
                        console.info("✅ Counter contract verified successfully");
                    } catch (error: any) {
                        if (error.message?.includes("Already Verified")) {
                            console.warn("Counter contract already verified");
                        } else {
                            console.error(`Verification failed: ${error.message}`);
                        }
                    }
                }
            },
        })).build();