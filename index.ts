import {AptosConfig, Network, Aptos, Ed25519PrivateKey, Account, PrivateKey, PrivateKeyVariants} from "@aptos-labs/ts-sdk";

import dotenv from "dotenv";
dotenv.config(); 

// Load environment variables -- only on my local 
const PETRA_PRIVATE_KEY = process.env.PETRA_PRIVATE_KEY!;
const FULL_NAME = process.env.FULL_NAME!;
const GITHUB = process.env.GITHUB!;
const EMAIL = process.env.EMAIL!;
const DISCORD = process.env.DISCORD!;

const formattedPrivateKey = PrivateKey.formatPrivateKey(PETRA_PRIVATE_KEY, PrivateKeyVariants.Ed25519);

async function main() {
    // Create aptos instance and set it to testnet
    const config = new AptosConfig({ network: Network.TESTNET });
    const aptos = new Aptos(config);

    // Wallet Account
    const PRIVATE_KEY = new Ed25519PrivateKey(formattedPrivateKey); // edit
    // You can get your private key, by going to your Petra wallet
    const MY_ACCOUNT = Account.fromPrivateKey({
        privateKey: PRIVATE_KEY,
    });
    
    
    // Check balance (Make sure you have some APT)
    const myBalance = await aptos.getAccountAPTAmount({
        accountAddress: MY_ACCOUNT.accountAddress,
    });
    // Kindly get some here `https://aptos.dev/en/network/faucet`

    // Build the transaction - Fill the functionArugments as required
    const transaction = await aptos.transaction.build.simple({
        sender: MY_ACCOUNT.accountAddress,
        data: {
          function:
            "0x777b93e13ff2a1bc872eb4d099ae15a52fb70f2f01dd18d7c809e217fb0e543e::tba_exam::add_participant",
          functionArguments: [
            "0x539f880b3da2bc33d98b5efbf611eb76b6a980b0fdb15badb537767e0767d6e3",
            FULL_NAME,  // edit
            GITHUB,
            EMAIL,
            DISCORD,
          ],
        },
    });

    const senderAuthenticator = aptos.transaction.sign({
        signer: MY_ACCOUNT,
        transaction,
    });

    const pendingTransaction = await aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator,
    });

    // Wait for the transaction to propagate
    const txnResult = await aptos.waitForTransaction({
        transactionHash: pendingTransaction.hash,
    });
      
    // optional: so we can see if it succeeded
    console.log(
        `Transaction completed with status: ${
          txnResult.success ? "SUCCESS" : "FAILURE"
        }`
    );

}

main().catch(console.error);    


