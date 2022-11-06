# レクリエーション系web3アプリ、『Encounter NFT Generator』
## プロジェクト概要
当プロダクトは、自分の行動や趣味趣向によってパーソナライズ化される未来に対してのカウンターカルチャーとして生まれました。<br>
その名もレクリエーション系web3アプリ、【Encounter NFT Generator】です。

自分の持つ今の「感情（Emotion）」と、見知らぬ誰かが置いていった「感情」を使い、自分と誰かとの「ご縁（Encounter）」をブロックチェーンでつないでコラボNFTを作成します。NFTなので、当然、NFTマーケットプレイスに公開・出品する事が可能になります。

不意にどこかの誰か、あるいはセレブ（！？）とコラボして、同じルーツのNFTを持つことは、日々あらゆることがパーソナライズされていくこの世界のなかで、とても「エモい」ことではないでしょうか。

今後、ユーザが入力するテキストに加えてNFTが保持しうるあらゆるデータを取り込みながら、このプロダクトを通じて感情を揺さぶるweb3ソーシャルツールの追求を目指します。

### プロダクトURL
<a href=https://nft-maker-starter-project-mu.vercel.app/ target="_blank">https://nft-maker-starter-project-mu.vercel.app/</a>

+ 使用したブロックチェーン：Goerli
+ コントラクトアドレス：<a href=https://goerli.etherscan.io/address/0xb0b6c854fb4b04ca4ebff06522bc155753d25912 target="_blank">0xb0b6c854fb4b04ca4ebff06522bc155753d25912</a>


#### テスト手順
1. GoerliネットワークでURLにアクセスします。
2. 「Connect to Wallet」ボタンでウォレットを接続します。
3. 入力欄に自由な今の想いを入力します。
入力欄の上部にはコラボ相手のアドレス、想いが記載されていますので、呼応する形で書き連ねてもOKです。
4. 送信ボタンを押下します。しばらく待つとNFTがmintされます。画面下部のOpenSeaリンクより確認できます。

### Tech Stacks
AIによる画像生成と、NFTのmintをワンクリックで行えるよう、フロントエンド、画像生成API、スマートコントラクトの処理をシームレスに接続しました。
2ユーザーの入力によるコラボレーションは、入力文を結合し、日本語⇒英語に翻訳した後、
AI画像生成APIに渡す方法で生成しています。
+ フロントエンド：React, Google翻訳API, OpenSea API
+ バックエンド(サーバ): Stable Diffusion API(DreamStudio), flask(Python)
+ バックエンド(blockchain): Solidity



### 使用したGithubリポジトリ
+ <a href=https://github.com/YasuYasuonFire/nft-maker-starter-project target="_blank">フロントエンド(React)</a>
+ <a href=https://github.com/YasuYasuonFire/flaskTest target="_blank">Stable DiffusionのAI画像生成API呼び出し(Python)</a>
+ <a href=https://github.com/YasuYasuonFire/nft-maker-contract target="_blank">スマートコントラクト(solidity)</a>
