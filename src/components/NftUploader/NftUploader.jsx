import { ethers } from "ethers";
import { Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from 'react';
//import ImageLogo from "./image.svg";
import "./NftUploader.css";
import Web3Mint from "../../utils/Web3Mint.json";
import { Web3Storage } from 'web3.storage';
const API_KEY ="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDMxZjlkYzFiMDk5YkZmMDE5NjIwM2NmNzJiNzAwNzllY0ZDOWNCMGMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NjY0OTU2ODk1MjQsIm5hbWUiOiJ0ZXN0In0.pzP-JzijNa2HEb_lFy1uPn_Fi64Frdips-kGjFlhzfY";

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
        console.log("Minting...please wait.");
        await nftTxn.wait();
        console.log(
          `Minted!!, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
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
  const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }

  // NftUploader.jsx
  const imageToNFT = async (e) => {
    e.preventDefault()
    const client = new Web3Storage({ token: API_KEY })
    const title = e.target.title.value
    const description = e.target.description.value
    console.log("title:",title)
    console.log("description:",description)
    
    //descriptionの文字列を入力として、SDで画像生成して結果を得る
    const response = await fetch('https://flasktest-gold.vercel.app/stableDiffusion/' + description)
    const myBlob = await response.blob()
    //blobに属性追加
    myBlob.name = 'image.jpeg';
    myBlob.lastModified = new Date();
    
    //Blob⇒Fileに変換
    const myFile = new File([myBlob], 'image.jpeg', {
      type: myBlob.type,
  });

    //FileListを新規作成
    const dt = new DataTransfer();
    dt.items.add(myFile);
    
    console.log("uploding to ipfs. Please wait..")
    //const rootCid = await client.put(image.files, {
    const rootCid = await client.put(dt.files, {
        name: title,
        maxRetries: 3
    })
    
    console.log("rootCid: ", rootCid)

    // rootCID+ファイル名でアクセスするよう変更
    const imageURI = rootCid + '/' + 'image.jpeg'
    console.log("title: ",title)
    console.log("description: ",description)
    console.log("imageURI: ",imageURI)

    askContractToMintNft(title, description, imageURI)
  
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
        <p>Title</p>
        <input type="text" name="title" maxlength="20"></input>
        
        <p>description (input for Stable Diffusion)</p>
        <input type="text" name="description" maxlength="50"></input>

        <p>Mint!</p>
        <input type="submit"/>
      </form>

    </div>
  );
};

export default NftUploader;