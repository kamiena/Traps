# Traps
Traps officialWebSite

カードタイプの2人対戦ゲーム「トラップス」の公式サイトです。
ビルド不要の静的サイト（HTML / CSS / JavaScript）なので、そのままサーバーや GitHub Pages に置けば公開できます。

## ファイル構成

```
index.html              ページ本体（文章はすべてここ）
assets/css/style.css    デザイン（色・文字・レイアウト）
assets/js/main.js       スマホメニュー／「遊び方」の動くデモ
assets/img/             画像（キービジュアル・ロゴ・クマチ・カード・OGP）
favicon.ico             ブラウザのタブに出るアイコン
apple-touch-icon.png    スマホのホーム画面アイコン
```

### 画像

| ファイル | 内容 |
| --- | --- |
| `kv-1920.webp` / `kv-1280.webp` | キービジュアル（PC・タブレットのトップ） |
| `logo.webp` | ロゴ（背景透過） |
| `kumachi-stand.webp` / `kumachi-jump.webp` | クマチ（背景透過） |
| `kumachi-token.webp` | クマチのコマ（遊び方デモ・勝利条件で使用） |
| `card-plus1.webp` 〜 `card-minus2.webp` | トラップカード5種（+1 / +2 / +4 / −1 / −2） |
| `ogp.jpg` | SNSでシェアされたときの画像（1200×630） |
| `card-back.webp` / `card-back-soft.webp` | カード裏面（通常／遊び方デモ用に色を薄くしたもの） |
| `pattern-back.webp` | カード裏の柄から作った背景模様（透過。色はCSSの `--pattern` で指定） |

カード画像は角丸なしの正方形で保存し、サイト上で角丸にしています。

## 手元で確認する

```sh
python3 -m http.server 8000
# → ブラウザで http://localhost:8000 を開く
```

`index.html` をダブルクリックして開いても表示できます。

## 公開（GitHub Pages）

公開URL：https://kamiena.github.io/Traps/

`main` ブランチの内容がそのまま公開されます（Settings → Pages で「Deploy from a branch」・`main`・`/ (root)` を選択）。
`main` に push すると、数分で公開サイトに反映されます。

独自ドメインに移すときは、`index.html` の `canonical` / `og:url` / `og:image` の URL も書き換えてください（SNS のシェア画像に必要です）。

## よく変更しそうな箇所

- **発売時期・価格**：`index.html` の「商品情報」（`class="spec"`）の「未定」を書き換え
- **カード名・効果**：`index.html` の「トラップカード」（`class="trap"`）
- **色**：`assets/css/style.css` 冒頭の `:root` にまとめています

## 仮で入れている内容（確定したら差し替え）

- カード名「大ドラ」（+4）、「天使のスズ」（+2）、「濃厚なハチミツ」（−2）
- キャラクター紹介文・セリフ・「すきなもの／にがてなもの」
- 「遊び方」デモのフィールドの大きさ（7×5 マス）とクマチのスタート位置（まんなか）
