// import { ethers } from "./ethers-5.6.esm.min.js";
// import { abi, contractAddress } from "./constants.js";

// const connectButton = document.getElementById("connectButton");
// const fundButton = document.getElementById("fundButton");
// connectButton.onclick = connect();
// fundButton.onclick = fund();

// async function connect() {
//   if (typeof window.ethereum !== "undefined") {
//     try {
//       await window.ethereum.request({ method: "eth_requestAccounts" });
//     } catch (error) {
//       console.log(error);
//     }

//     connectButton.innerHTML = "Connected";
//   } else {
//     connectButton.innerHTML = "pls install metaMask";
//   }
// }

// async function fund() {
//   const _ethAmount = "0.1";
//   console.log(`funding with ${_ethAmount}...`);
//   if (typeof window.ethereum !== "undefined") {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(contractAddress, abi, signer);
//     try {
//       const transactionResponse = await contract.fund({
//         value: ethers.utils.parseEther(_ethAmount),
//       });
//       await listenForTransactionMine(transactionResponse, provider);
//       console.log("Done");
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// function listenForTransactionMine(transactionResponse, provider) {
//   console.log(`mining ${transactionResponse.hash}.....`);
//   return new Promise((resolve, reject) => {
//     provider.once(transactionResponse.hash, (transactionReceipt) => {
//       console.log(
//         `completed with ${transactionReceipt.confirmations} confirmations`
//       );
//       resolve();
//     });
//   });
// }

import { ethers } from "./ethers-5.6.esm.min.js";
import { contractAddress, abi } from "./constants.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const WithdrawButton = document.getElementById("WithdrawButton");

connectButton.onclick = connect;
balanceButton.onclick = balance;
fundButton.onclick = fund;
WithdrawButton.onclick = withdraw;

async function connect() {
  try {
    if (typeof window.ethereum !== "undefined") {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      connectButton.innerHTML = "connected";
    } else {
      connectButton.innerHTML = "install MetaMask";
    }
  } catch (error) {
    console.log(error);
  }
}

async function balance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}
async function fund() {
  const _ethAmount = document.getElementById("_ethAmount").value;
  console.log(`funding with.....${_ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const trasactionResponse = await contract.fund({
        value: ethers.utils.parseEther(_ethAmount),
      });
      fundButton.innerHTML = "funded";
      await getTrasactionMined(provider, trasactionResponse);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  }
}
//Withdraw
async function withdraw() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      console.log("withdrawing");
      const transactionResponse = await contract.withdraw();
      await getTrasactionMined(provider, transactionResponse);
    } catch (error) {
      console.log(error);
    }
  }
}
function getTrasactionMined(provider, transactionResponse) {
  console.log(`mining ${transactionResponse.hash}....`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}
