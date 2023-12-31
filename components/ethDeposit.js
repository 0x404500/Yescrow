import React, { useState } from 'react';
import { ethers } from "ethers";
import Image from 'next/image';
import { Web3Button } from '@thirdweb-dev/react';
import { Interface, FormatTypes } from 'ethers/lib/utils';
import styles from '../styles/Home.module.css';
import SendEmail from './sendEmail';


const humanReadableABI = [
  "function createDepositETH(address _seller) external payable",
  "event NewDepositETH(uint256 indexed currentId, address indexed buyer, address indexed seller, uint256 amount)"
  ];

  const iface = new Interface(humanReadableABI);
  const jsonABI = iface.format(FormatTypes.json);

export default function EthEscrowForm() {

  const [_amount, setDepositValue] = useState('')
  const [_seller, setSellerAddress] = useState('')

  function handleDepositChange(e) {
    setDepositValue(e.target.value);
  }

  function handleAddressChange(e) {
    setSellerAddress(e.target.value);
  }

  async function eventListener () {
    await ethereum.request({ method: 'eth_requestAccounts' })
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(process.env.NEXT_PUBLIC_MAINNET_ADDRESS, humanReadableABI, signer);
    var _email = prompt("Escrow created! Wait for the transaction to be mined. Congratulations, you are one of the first users of the protocol. ;) \n If you write down your email, you can get all the details sent there. \n Otherwise, wait a minute for a pop-up with your relevant info.");
    try {
      await fetch("/api/sendgrid", {
        body: JSON.stringify({
          message: _email,
          amount: _amount,
          seller: _seller,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
    } catch (error) {console.log(error);
    }
    try {
      contract.once("NewDepositETH", (counter, depositor, receiver, depositAmount, event) => {
          alert(
            "Your escrow ID which you will need to release the escrow is "+counter+
            "Escrow amount: "+JSON.stringify(depositAmount.toString())+
            "Transaction hash: "+event.transactionHash); 
            
      })
    } catch (error) {console.log(error)};
  }

  return (
          <div class="m-5">
              <div>
                <label>Stranger`s Ethereum address:</label>
                <br/>
                <input class="text-center rounded-xl mt-2 max-w-xs sm:max-w-md"
                  type="text" 
                  placeholder="0x..."
                  required
                  minLength="42"
                  maxLength="42"
                  size="50"
                  onChange={handleAddressChange} 
                />
                <br/>
                <br/>
                <label>ETH amount:</label>
                <br/>
                <div class="text-center">
                <input
                  class="rounded-xl mt-2 mb-2 text-center max-w-xs sm:max-w-md"
                  type="number" 
                  placeholder="Ξ0.00" 
                  step="any"
                  required
                  onChange={handleDepositChange} 
                  />
                </div>
                <br />
                <Web3Button 
                contractAddress={process.env.NEXT_PUBLIC_MAINNET_ADDRESS}
                contractAbi={jsonABI}
                action={async (contract) => { await contract.call("createDepositETH", [_seller], { value: ethers.utils.parseEther(_amount) })}}
                onError={() => alert("Make sure to fill out the fields properly and have enough ETH in the wallet. Message escrow@yescrow.io for guidance.")}
                onSuccess={() => eventListener()}
                className={styles.btn}
                >
                <li class="flex items-center">
                <Image
                  src="/lock_icon.png" 
                  class="fill-current h-6 w-6 mr-1" 
                  width="48" 
                  height="48" 
                  alt="lock icon">
                </Image> Escrow</li>
                  </Web3Button>
              </div>
        </div>
  );
}
