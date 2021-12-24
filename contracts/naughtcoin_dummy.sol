pragma solidity 0.8.4;


contract NaughtCoinExploit{
    address addr;

    constructor() public{
        addr = address(this);
    }

    function getAddr() public view returns(address){
        return address(this);
    }
}