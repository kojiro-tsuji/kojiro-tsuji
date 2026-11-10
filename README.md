<h1 align="center">Kojiro Tsuji</h1>

<p align="center">
  Indie developer — iOS / Android, Web, Desktop<br>
  企画・設計・実装・リリースまでを一人で担う個人開発者です。
</p>

---

## About

モバイル・Web・デスクトップのアプリケーションを、要件定義から設計・実装・ストア公開・運用まで一貫して手がけています。App Store で公開中のアプリがあります。

- **データは端末の中に置く。** できるだけ自前のサーバーを持たず、ユーザーのデータを端末の SQLite で管理します。課金もサーバーなしで、正しく数える仕組みを作っています
- **ルールをコードで守る。** 層の依存方向を dependency-cruiser で機械的に検査し、純粋関数に分けた業務ロジックを単体テストで固めます。アルゴリズムには版を付け、結果をゴールデンテストで固定します
- **プラットフォームの深いところまで扱う。** EventKit、Live Activity、Kotlin のネイティブモジュール、Win32 API の直接呼び出しなど、フレームワークの外側まで必要に応じて実装します
- **AI エージェントを組織として運用する。** 実装役とレビュー役を分けたエージェントのチームと、その運用基盤（権限の制御・品質ゲート・記録）を自分で設計し、日々の開発に使っています

> I build and ship mobile, web and desktop apps end to end — from requirements and architecture to App Store release. My work favors on-device data, deterministic and well-tested domain logic, and going below the framework when the platform demands it. I develop alongside a team of AI agents running on an orchestration harness I designed myself.

## Tech Stack

| 分野 | 技術 |
|---|---|
| Languages | TypeScript, Go, Kotlin, SQL |
| Mobile | React Native, Expo（EAS Build / Submit）, Reanimated, React Native Skia, expo-sqlite, Drizzle ORM, RevenueCat |
| Web | Next.js（App Router / Server Actions）, React, Tailwind CSS, Auth.js, Zod, SWR, Monaco Editor |
| Backend / Infra | Cloudflare Workers（Hono, D1, R2, KV）, PostgreSQL（Neon, Supabase）, Prisma, Vercel |
| Desktop | Go, Wails, Win32 API |
| Quality | Jest, Vitest, dependency-cruiser, ESLint, Biome, GitHub Actions |

## Projects

### Mobile

<table>
  <tr>
    <td width="96" align="center" valign="top"><img src="assets/icons/rintan.png" width="72" alt="リンタン"></td>
    <td valign="top">
      <b>リンタン（Rintan）</b> — 単語帳アプリ（iOS）<br>
      <a href="https://apps.apple.com/jp/app/id6824786446">App Store</a> · <a href="https://kojiro-tsuji.github.io/rintan-site/">製品ページ</a><br>
      紙の単語カードのように、スワイプでめくって覚える単語帳です。学習を続けると、画面の上に住むキャラクターのもとに、アイテムや仲間が増えていきます。
      <ul>
        <li>カードの位置を UI スレッドの共有値で持ち、React の再描画を通さずに動かします。判定は先に画面へ出し、保存は裏で順に行います（楽観的更新）</li>
        <li>サーバーなしで消耗型課金を正しく数えます。ストア側の時刻を基準にし、DB の一意制約とトランザクションで二重計上を防ぎます。残高は持たず、増減の記録から合計を出します</li>
        <li>iOS の日本語入力で、確定前の文字が次のカードに残る問題を、入力欄の作り直しと世代番号で解決しました</li>
        <li>Jest のテスト 205 件。カード 1,000 枚でも 100ms 以内に読み込みます</li>
      </ul>
      <sub>Expo · React Native · TypeScript · Reanimated · expo-sqlite · RevenueCat</sub>
    </td>
  </tr>
  <tr>
    <td width="96" align="center" valign="top"><img src="assets/icons/aya.png" width="72" alt="紋 aya"></td>
    <td valign="top">
      <b>紋 aya</b> — QR コードから紋様を生み出すアプリ（iOS）<br>
      <a href="https://kojiro-tsuji.github.io/aya-site/">製品ページ</a><br>
      身の回りの QR コードを読むと、その中身から一つだけの紋様が生まれ、図鑑に集まります。集めた紋様は壁紙や印刷用の作品にできます。
      <ul>
        <li>QR の中身の SHA-256 だけから紋様を決める、決定的な生成です。ライブラリの更新で結果が変わらないよう、SHA-256 は自前で実装しました。200 件のゴールデンテストで結果を固定し、アルゴリズムには版を付けて凍結しています</li>
        <li>QR の中身は保存も送信もしません。残すのはハッシュだけで、サーバーも持ちません</li>
        <li>図鑑の絵は Skia で画面の外に描き、1 フレームに 1 枚ずつ PNG にします。Canvas を多く並べると Android で止まる問題を、この方法で避けました。タイルの継ぎ目に出る線は、アンチエイリアスの制御とピクセル揃えで消しています</li>
        <li>iOS 26 の Liquid Glass に対応しています。Android と古い iOS では、ガラスの表現を自前で再現しました</li>
      </ul>
      <sub>Expo · React Native · React Native Skia · Zustand · expo-sqlite · Vitest · dependency-cruiser</sub>
    </td>
  </tr>
  <tr>
    <td width="96" align="center" valign="top"><img src="assets/icons/punkard.png" width="72" alt="PunKard"></td>
    <td valign="top">
      <b>PunKard</b> — 時間記録アプリ（iOS / Android）<br>
      <i>Coming soon</i><br>
      カードをめくって時間を計り、計った時間帯を端末のカレンダーに予定として残します。毎日の操作は、ホーム画面だけで終わります。
      <ul>
        <li>pnpm のモノレポで、アプリ（Expo）・API（Cloudflare Workers + Hono + D1）・共有の型（Zod）を一つにまとめています</li>
        <li>EventKit と Calendar Provider でカレンダーに書き込みます。iOS は Live Activity / Dynamic Island、Android は Kotlin の自前モジュールで、計測中の表示を出します</li>
        <li>オフラインでも計測でき、あとからまとめて同期します。サーバーは、本物のメールアドレスも OAuth トークンも持ちません</li>
        <li>依存の向き（components → stores → core）を機械的に検査します。GitHub Actions で、型チェック・テスト（200 件以上）・lint・依存検査を毎回実行します</li>
      </ul>
      <sub>Expo · React Native · Drizzle · Cloudflare Workers · Hono · D1 · better-auth · Kotlin</sub>
    </td>
  </tr>
</table>

<sub>モバイルアプリのソースコードは非公開です。 / Source code for the mobile apps is private.</sub>

### Web

<table>
  <tr>
    <td width="96" align="center" valign="top"><img src="assets/icons/stint.png" width="72" alt="Stint"></td>
    <td valign="top">
      <b><a href="https://github.com/kojiro-tsuji/stint">Stint</a></b> — 作業時間を Google カレンダーに記録する PWA<br>
      <a href="https://stint-app-kojiro-tsujis-projects.vercel.app">Live demo</a><br>
      スワイプでタスクを始めて終えると、その時間帯が Google カレンダーに予定として書き込まれます。
      <ul>
        <li>Google Calendar API を <code>fetch</code> で直接呼びます。セッション ID をイベント ID に使い、何度送り直しても予定が重ならないようにしています（冪等性）</li>
        <li>進行中のセッションは一人一件までを、DB の一意制約で保証します。時刻はサーバー側で記録します</li>
        <li>スワイプの代わりに長押しでも操作できます（アクセシビリティ）</li>
      </ul>
      <sub>Next.js · Auth.js · Prisma · PostgreSQL（Neon） · Zod · Vercel</sub>
    </td>
  </tr>
</table>

| Project | 内容 | 技術上のポイント | Tech |
|---|---|---|---|
| **[WARIKAN](https://github.com/kojiro-tsuji/warikan)**<br>[Live demo](https://warikan-gold.vercel.app) | ログイン不要の割り勘アプリ。URL を共有するだけで使えます | 1 円単位の整数計算で、合計が必ず 0 になる精算を出し、送金回数を少なくします。Repository で画面とデータ層を分け、書き込みは Server Actions と Zod で検証します | Next.js · Drizzle · Neon |
| **[tsdrill](https://github.com/kojiro-tsuji/ts-drill)** | ブラウザで TypeScript の問題（100 問）を解く演習アプリ | 変換と実行を別々の Web Worker で行い、制限時間を過ぎた実行は止めます。無限ループでも画面は固まりません。全 100 問の模範解答を、スクリプトで自動検証しています | Next.js · Monaco · Cloudflare Workers |
| **[便利ツール集](https://github.com/kojiro-tsuji/textcounter-app)**<br>[Live demo](https://textcounter-app.vercel.app) | 文字数カウンター・パスワード生成・画像→PDF | 処理はすべてブラウザの中で行います。パスワードは <code>crypto.getRandomValues()</code> で作り、セキュリティヘッダーも付けています | Next.js · Tailwind CSS · jsPDF |
| **[Task App](https://github.com/kojiro-tsuji/task-app-asana-clone)**<br>[Live demo](https://task-app-asana-clone.vercel.app/) | Asana を参考にしたチーム向けタスク管理 | 認証を自作しました（PBKDF2、HttpOnly Cookie の JWT）。DB が遠く応答が遅いため、操作はすべて楽観的更新にし、取り消しもできます | Next.js · Prisma · Supabase |

### Desktop

| Project | 内容 | 技術上のポイント | Tech |
|---|---|---|---|
| **[Clipboard Manager](https://github.com/kojiro-tsuji/Clibor-clone)** | クリップボードの履歴と定型文を管理します。ホットキーで呼び出して、自動で貼り付けます | <code>user32.dll</code> を直接呼び、貼り付けと前面ウィンドウの復帰を行います。純 Go の SQLite を使い、CGO なしでビルドできます。タグを付けると GitHub Actions がビルドして Release に出します | Go · Wails · React · SQLite |
| **[cursor-mood-app](https://github.com/kojiro-tsuji/cursor-mood-app)** | タスクトレイから、マウスカーソルの形を切り替える常駐ツール | <code>SetSystemCursor</code> でシステムのカーソルを切り替えます。名前付き Mutex で二重起動を防ぎ、設定ファイルを書き換えるだけで、ビルドし直さずにメニューを変えられます | Go · Win32 API |

## GitHub Stats

<p>
  <img height="165" src="https://github-readme-stats.vercel.app/api?username=kojiro-tsuji&show_icons=true&hide_border=true&count_private=true&theme=transparent" alt="GitHub stats" />
  <img height="165" src="https://github-readme-stats.vercel.app/api/top-langs/?username=kojiro-tsuji&layout=compact&hide_border=true&theme=transparent" alt="Top languages" />
</p>
