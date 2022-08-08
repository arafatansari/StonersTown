const { createAlchemyWeb3 } = require('@alch/alchemy-web3');


const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_ALCHEMY_RPC_URL);
import { config } from '../dapp.config'

const contract = require("../artifacts/contracts/STW.sol/StonersTownWtf.json");
const nftContract = new web3.eth.Contract(contract.abi, config.contractAddress);

export const getTotalMinted = async () => {
  const totalMinted = await nftContract.methods.totalSupply().call();
  return totalMinted
};
// getTotalMinted getMaxSupply isPublicSaleState getPrice

export const getMaxSupply = async () => {
  const maxSupply = await nftContract.methods.maxbuds().call();
  return maxSupply
};

export const getWalletLimit = async () => {
  const maxWalletLimit = await nftContract.methods.freeBudPerWallet().call();
  return maxWalletLimit
};


export const isPublicSaleState = async () => {
  const publicSale = await nftContract.methods.IS_SALE_ACTIVE().call();
  return publicSale
};

export const getPrice = async () => {
  const price = await nftContract.methods.budPrice().call();
  return price
};

export const MaxMintAmount = async () => {
  const result = await nftContract.methods.maxBudPerTrans().call();
  return result;
};

export const publicMint = async (mintAmount) => {
  if (!window.ethereum.selectedAddress) {
    return {
      success: false,
      status: 'To be able to mint, you need to connect your wallet'
    }
  }

  const nonce = await web3.eth.getTransactionCount(
    window.ethereum.selectedAddress,
    'latest'
  );

  // Set up our Ethereum transaction
  const tx = {
    to: config.contractAddress,
    from: window.ethereum.selectedAddress,
    value: parseInt(
      
// //       Comment the below line once FREE Mint is Over !
//       web3.utils.toWei(String(config.freeMint * mintAmount), 'ether')
      
      // Uncomment the below line once FREE Mint is Over !
      web3.utils.toWei(String(config.price * mintAmount), 'ether')
      
    ).toString(16), // hex
    data: nftContract.methods.mint(mintAmount).encodeABI(),
    nonce: nonce.toString(16)
  };

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [tx]
    })

    return {
      success: true,
      status: (
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank">
          <p>Check out your transaction on Etherscan : </p>
          <p>{`https://etherscan.io/tx/${txHash}`}</p>
        </a>
      )
    };
  } catch (error) {
    return {
      success: false,
      status: 'Something went wrong : ' + error.message
    };
  }
};
