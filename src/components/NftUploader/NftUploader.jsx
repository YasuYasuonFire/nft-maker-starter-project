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
  
  const askContractToMintNft = async (ipfs) => {
    const CONTRACT_ADDRESS =
      "0x05497AB6cA031E09ebE9187619cdBDB25E0E4eB6";
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
        let nftTxn = await connectedContract.mintIpfsNFT(ipfs);
        console.log("Minting...please wait.");
        await nftTxn.wait();
        console.log(
          //`Minted!!, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
          `Minted!!, see transaction: https://mumbai.polygonscan.com/tx/${nftTxn.hash}`
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

  const translate = (description) => {
    const text = description
    const fromLang = 'ja'
    const toLang = 'en'
    const apiKey = 'AIzaSyCn_yaZmmrbG-6dbjc2r1eONUpw3kNGdH0'
    // 翻訳
    const URL = "https://translation.googleapis.com/language/translate/v2?key="+apiKey+"&q="+encodeURI(text)+"&source="+fromLang+"&target="+toLang
    let xhr = new XMLHttpRequest()
    xhr.open('POST', [URL], false)
    xhr.send();
    if (xhr.status === 200) {
        const res = JSON.parse(xhr.responseText); 
        const output = res["data"]["translations"][0]["translatedText"]
        //alert(res["data"]["translations"][0]["translatedText"])
        return output
    }else{
      return ""
    }
  };
  
  // NftUploader.jsx
  const imageToNFT = async (e) => {
    e.preventDefault()
    
    const client = new Web3Storage({ token: API_KEY })
    //const title = e.target.title.value
    const hiduke=new Date(); 

    //年・月・日・曜日を取得し、NFTのタイトルに設定
    const year = hiduke.getFullYear();
    const month = hiduke.getMonth()+1;
    const week = hiduke.getDate();
    const title = year + '/' + month + '/' + week

    const description = e.target.description.value
    console.log("title:",title)
    console.log("description:",description)
    
    //日本語のdescriptionを翻訳
    const description_en = translate(description)
    console.log("translate description")
    if(description_en == ""){//翻訳APIでエラーの場合
      console.log("EROOR: translate failure")
      return 1
    }

    console.log("description:",description_en)

    const jumon = "Beautiful girl with long turqoise hair, cute, intricate, highly detailed, digital painting, trending on artstation, concept art, smooth, sharp focus, illustration, unreal engine 5, 8 k, art by artgerm and greg rutkowski and alphonse mucha"

    //descriptionの文字列を入力として、SDで画像生成して結果を得る
    const response = await fetch('https://flasktest-gold.vercel.app/stableDiffusion/' + jumon + description_en  ) //癒しの画像生成のためwordを追加
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
    
    console.log("uploding image to ipfs. Please wait..")
    //const rootCid = await client.put(image.files, {
    const rootCid = await client.put(dt.files, {
        name: title,
        maxRetries: 3
    })
    
    console.log("rootCid: ", rootCid)

    // rootCID+ファイル名でアクセスするよう変更
    const imageURI = "https://" + rootCid + ".ipfs.w3s.link" + '/' + 'image.jpeg'
    console.log("title: ",title)
    console.log("description: ",description)
    console.log("imageURI: ",imageURI)


    //メタデータとなるjsonファイルを作成し、IPFSへアップロードする
    let metadata = {
      "name":title,
      "description":description,
      "image":imageURI,
      "attributes": [
          {
            "trait_type": "BACKGROUND",
            "value": "Sankuzusi kurenai"
          },
          {
            "trait_type": "WING",
            "value": "Scarlet macaw"
          }
      ]
    }
    //Object⇒jsonに変換
    let metadata_json = JSON.stringify(metadata)
    //json⇒Fileに変換
    const myjsonFile = new File([metadata_json], 'meta.json', {
      type: metadata.type,
  });

    //FileListを新規作成
    const dt2 = new DataTransfer();
    dt2.items.add(myjsonFile);
    
    console.log("uploding metadata to ipfs. Please wait..")
    //const rootCid = await client.put(image.files, {
    const rootCid_meta = await client.put(dt2.files, {
        name: title,
        maxRetries: 3
    })
    
    console.log("rootCid: ", rootCid_meta)

    // rootCID+ファイル名でアクセスするよう変更
    const metadataURI = "https://" + rootCid_meta + '.ipfs.w3s.link' + '/' + 'meta.json'

    console.log("metadataURI: " + metadataURI)
    askContractToMintNft(metadataURI)
  
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
        <p>you can mint "Your Emotion" NFT</p>
      )}
      <div className="title">
        <h2>NFT Minter</h2>
      </div>
  
      <form onSubmit = {imageToNFT}>
        <p>Write down your emotion.</p>
        <textarea type="text" name="description" cols='30' rows='10' placeholder="English OK 日本語もOK"></textarea>

        <p>Mint!</p>
        <input type="submit"/>
      </form>
    </div>
  );
};

export default NftUploader;