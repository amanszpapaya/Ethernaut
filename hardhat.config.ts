import { HardhatUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-waffle";

const PRIMARY_ACCOUNT_KEY = "key"
//const SECONDARY_ACCOUNT_KEY = "key2";

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    rinkeby: {
      url: "Rinkeby url",
      //accounts: [`0x${PRIMARY_ACCOUNT_KEY}`, `0x${SECONDARY_ACCOUNT_KEY}`]
      accounts: [`0x${PRIMARY_ACCOUNT_KEY}`]

    },
    hardhat: {
      forking: {
        url: "Rinkeby URL",
        blockNumber: 8722464,
      },
    },
  } 
};

export default config; 