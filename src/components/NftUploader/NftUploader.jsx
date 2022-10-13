import { ethers } from "ethers";
import { Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from 'react';
//import ImageLogo from "./image.svg";
import "./NftUploader.css";
import Web3Mint from "../../utils/Web3Mint.json";
import { Web3Storage } from 'web3.storage';
const API_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMxZjlkYzFiMDk5YkZmMDE5NjIwM2NmNzJiNzAwNzllY0ZDOWNCMGMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjU1NDI5NjA5ODYsIm5hbWUiOiJGb3JVcGxvYWRlciJ9.IpfQWx3VJzRy-qyfkclj6S081jRt72iB3Xz5dBOMUrQ";

const NftUploader = () => {
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState("");
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);
  const checkIfWalletIsConnected = async() => {
    /*
     * ユーザーがMetaMaskを持っているか確認します。
     */
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  
  const connectWallet = async () =>{
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
       * ウォレットアドレスに対してアクセスをリクエストしています。
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      /*
       * ウォレットアドレスを currentAccount に紐付けます。
       */
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  
  const askContractToMintNft = async (title, description, ipfs) => {
    const CONTRACT_ADDRESS =
      "0x70391E2abeE9999611a0B957c2470Aa9042749e2";
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.mintIpfsNFT(title,description,ipfs);
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(
          `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderNotConnectedContainer = () => (
      <button onClick={connectWallet} className="cta-button connect-wallet-button">
        Connect to Wallet
      </button>
    );
  // NftUploader.jsx
  const imageToNFT = async (e) => {
    e.preventDefault()
    const client = new Web3Storage({ token: API_KEY })
    const image = e.target.myfile
    //console.log(image)
    const title = e.target.title.value
    const description = e.target.description.value
    console.log("title:",title)
    console.log("description:",description)
    console.log("uploding to ipfs. Please wait..")
    const rootCid = await client.put(image.files, {
        name: 'experiment',
        maxRetries: 3
    })
    const res = await client.get(rootCid) // Web3Response
    const files = await res.files() // Web3File[]
    for (const file of files) {
      console.log("file.cid:",file.cid)
      askContractToMintNft(title, description, file.cid)
    }
  }




  /*
   * ページがロードされたときに useEffect()内の関数が呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  
  return (
    <div className="outerBox">
      {currentAccount === "" ? (
        renderNotConnectedContainer()
      ) : (
        <p>If you choose image, you can mint your NFT</p>
      )}
      <div className="title">
        <h2>NFT Minter</h2>
      </div>
      {/*<div className="nftUplodeBox">
        <div className="imageLogoAndText">
          <img src={ImageLogo} alt="imagelogo" />
          <p>ここにドラッグ＆ドロップしてね</p>
        </div> 
        <input className="nftUploadInput" multiple name="imageURL" type="file" accept=".jpg , .jpeg , .png"  onChange={imageToNFT}/>
      </div>*/}
      <form onSubmit = {imageToNFT}>
        <p>Choose a pic file</p>
        <input type="file" name="myfile" accept=".jpg , .jpeg , .png"/>
        
        <p>Title</p>
        <input type="text" name="title"></input>
        
        <p>description</p>
        <input type="text" name="description" size="30"></input>

        <p>Mint!</p>
        <input type="submit"/>
      </form>

    </div>
  );
};

export default NftUploader;