# レクリエーション系web3アプリ、『Encounter NFT Generator』
## プロジェクト概要
当プロダクトは、自分の行動や趣味趣向によってパーソナライズ化される未来に対してのカウンターカルチャーとして生まれました。<br>
その名もレクリエーション系web3アプリ、【Encounter NFT Generator】です。<br><br>
見知らぬ誰かとのご縁（En）で、コラボNFTを作成することができます。NFTなので、当然、NFTマーケットプレイスに出品・公開する事が可能になります。<br><br>
不意にどこかの誰か、あるいはセレブとコラボして、同じルーツのNFTを持つことは、どんどんパーソナライズ化されていくこの世界のなかでとても「エモい」ことではないでしょうか。<br>今後、私たちはこのプロダクト通じて、作成されるNFTをキーにしながら、新たな出会いの形態としてのweb3的ソーシャルツールの追求を目指します。

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
