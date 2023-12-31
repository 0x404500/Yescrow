import Link from "next/link";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const ESCROW_ABI = [
  "function createDepositERC20(address _seller, address _token, uint256 _amount) external",
  "event NewDepositERC20(uint256 indexed currentId, address indexed buyer, address indexed seller, address token, uint256 amount)",
];

const ERC20_ABI = [
  "function approve(address _spender, uint256 _value) external"
];

export default function EscrowForm() {
  const [_tokenAmount, setAmount] = useState("");
  const [_seller, setSellerAddress] = useState("");
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [accounts, setAccounts] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  function handleAmountChange(e) {
    setAmount(e.target.value);
  }

  function handleAddressChange(e) {
    setSellerAddress(e.target.value);
  }

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      setHasMetaMask(true);
    }
  }, []);

  async function blockchainTalk(e) {
    e.preventDefault();
    if (hasMetaMask == true) {
      const chainId = await ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0x1") {
        alert("Please select the Ethereum mainnet on your MetaMask.");
      }
      if (chainId == "0x1") {
        try {
          const accounts = await ethereum.request({ method: "eth_accounts" });
          if (accounts.length == 0) {
            alert("Connect your Metamask account"); } else {
            setAccounts("Your Ethereum account "+accounts+" is connected. You may escrow now.")  
            if (isConnected == false) {
              setIsConnected(true);
            }
          }
        } catch (e) {
          console.log(e);
        }
      }
      try {
        if (active) {
          const signer = provider.getSigner();
          const ERC20Address = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";

          const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_MAINNET_ADDRESS,
            ESCROW_ABI,
            signer
          );

          const ERC20Contract = new ethers.Contract(
            ERC20Address,
            ERC20_ABI,
            signer
          );

          try {
            const approveTx = await ERC20Contract.approve(
              contract.address,
              ethers.utils.parseUnits(_tokenAmount, 8),
              {
                gasLimit: 100000,
              }
            );

            alert("Approving spending of WBTC tokens...");
            await approveTx.wait();

            alert("Approved spending of WBTC. You can escrow now.");
            const createDepositTx = await contract.createDepositERC20(
              _seller,
              ERC20Address,
              _tokenAmount,
              {
                gasLimit: 300000,
              }
            );
            await createDepositTx.wait();
          } catch (error) {
            console.log(error),
              alert(
                "The transaction failed. Please make sure you approve escrowing the tokens in your Metamask account and try again."
              );
          }

          try {
            contract.on(
              "NewDepositERC20",
              (
                counter,
                buyerAddress,
                sellerAddress,
                tokenAddress,
                _tokenAmount,
                event
              ) => {
                console.log(
                  "Buyer address: " + buyerAddress,
                  "Seller address: " + sellerAddress,
                  "Escrow amount: " + _tokenAmount,
                  "Escrow ID: " + counter,
                  "Token address: " + tokenAddress,
                  "Transaction hash: " + event.transactionHash
                );

                alert(
                  "Appreciate the patience. Your escrow has been created. Save your ID#: " +
                    counter +
                    "."
                );
              }
            );
          } catch (error) {
            console.log(error);
          }
        }
      } catch (e) {
        console.log(e);

        alert(
          "Fix the error and please make sure to fill in the form correctly."
        );
      }
    } else {
      alert("Please install MetaMask browser extension.");
    }
  }

  function alerter() {
    alert("Send bitcoin to escrow address bc1qd0mr7dekwdk08rrppthee40yfp2uuxwgh7fkxp and email the transaction hash to crow@yescrow.io to initiate.");
  }

  return (
    <div>
      <form onSubmit={blockchainTalk}>
        {/* Should alert if user clicks button but is not connected to mainnet */}
        <h1><span>♦</span> Bitcoin Escrow</h1>
        <br />
        <h2>
          WBTC is a tokenized version of bitcoin on Ethereum. This is
          a workaround for escrowing bitcoin on Ethereum`s smart contract
          system. <br/><br/><i>If you want to escrow actual bitcoin, please {" "}
          <a href='#' onClick={alerter}>
          follow these rules 
          </a> (not automated: 1% fee).
          <br /><br />
          Otherwise:</i>
        </h2>
        <div>
          <label>Receiver`s Ethereum address</label>
          <br />
          <input
            type="text"
            placeholder="0x..."
            required
            minLength="42"
            maxLength="42"
            onChange={handleAddressChange}
          />
          <br />
          <label>WBTC amount</label>
          <br />
          <input
            type="number"
            placeholder="₿"
            step="any"
            onChange={handleAmountChange}
            required
          />
                <br />
                <code>0.5% fee + gas</code>
                <br /><br />
          <button type="submit">♦ Escrow</button>
          <br/><code><small>{accounts}</small></code><br/><br/>
        </div>
      </form>
      <h3>
        Share your transaction hash to prove you have escrowed the funds.<br />
        <br />
        Then let the other party do their part.
      </h3><br/>
      <h4>
      <Link href="/btc/escrow">
      Release the escrow
      </Link> 
      {" "}when you are happy.</h4><br/>
      <p>It`s that simple.</p>
      <br />
      <br />
    </div>
  );
}
