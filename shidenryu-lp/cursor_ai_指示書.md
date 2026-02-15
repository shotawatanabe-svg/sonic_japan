# Cursor AI 指示書：剣舞会エッジ LP → Next.js 実装

## 🎯 プロジェクト概要

添付の `wireframe_v3.html` をベースに、Next.js（App Router）で予約機能付きのLP（ランディングページ）を構築してください。Vercelにデプロイします。

- **サービス内容**: ホテル客室への出張型・日本文化体験サービス（殺陣・茶道・書道など）
- **ターゲット**: ホテル宿泊中のインバウンド観光客（英語話者）
- **ユーザー導線**: ホテル室内のQRコード → LP → 予約リクエスト送信
- **最終的な表示言語**: 英語（ワイヤーフレームは日本語だが、本番は英語に翻訳して実装）

---

## 🏗 技術スタック

| 項目 | 指定 |
|------|------|
| フレームワーク | Next.js 14+（App Router） |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| ホスティング | Vercel |
| バックエンド | GAS WebApp（doGet / doPost）→ Googleスプレッドシート |
| メール送信 | GAS経由のGmail送信 |
| アニメーション | Framer Motion（任意） |

---

## 📁 ディレクトリ構成（推奨）

```
shidenryu-lp/
├── app/
│   ├── layout.tsx          # 共通レイアウト（フォント・メタデータ）
│   ├── page.tsx            # LPメインページ（実装済み）
│   ├── booking/
│   │   └── page.tsx        # 予約フォーム（5ステップ）
│   ├── thanks/
│   │   └── page.tsx        # リクエスト完了
│   ├── terms/
│   │   └── page.tsx        # 利用規約
│   ├── privacy/
│   │   └── page.tsx        # プライバシーポリシー
│   └── api/
│       ├── availability/
│       │   └── route.ts    # GET: 空き状況取得（GAS経由）
│       └── booking/
│           └── route.ts    # POST: 予約送信（GAS経由）
├── components/
│   ├── Header.tsx          # 固定ヘッダー（実装済み）
│   ├── Hero.tsx            # ファーストビュー（実装済み）
│   ├── About.tsx           # サービス紹介（実装済み）
│   ├── ServiceGrid.tsx     # 9つの体験カード（実装済み）
│   ├── ServiceDetailModal.tsx  # 体験詳細ボトムシート（実装済み）
│   ├── SessionFlow.tsx     # 90分の体験フロー（実装済み）
│   ├── Pricing.tsx         # 料金セクション（実装済み）
│   ├── AvailabilityCalendar.tsx  # ★空き状況カレンダー
│   ├── Info.tsx            # 基本情報カード（実装済み）
│   ├── FAQ.tsx             # よくある質問（実装済み）
│   ├── CTASection.tsx      # 予約導線CTA（実装済み）
│   ├── Footer.tsx          # フッター（実装済み）
│   └── booking/
│       ├── StepCalendar.tsx    # ★Step 1: 日付選択
│       ├── StepTimeSlots.tsx   # ★Step 2: 時間帯選択
│       ├── StepActivities.tsx  # ★Step 3: 体験3つ選択
│       ├── StepGuestInfo.tsx   # ★Step 4: 情報入力
│       ├── StepConfirm.tsx     # ★Step 5: 確認+送信
│       └── ProgressBar.tsx     # ★進捗バー
├── lib/
│   ├── services.ts         # 9つの体験データ（実装済み）
│   ├── availability.ts     # ★空き状況fetch関数
│   └── booking.ts          # ★予約送信関数+型定義
├── public/
│   └── images/
├── tailwind.config.ts
└── package.json
```

---

## 📄 画面構成とルーティング

### ページ1: `/` （LPメイン — SCREEN 1）
ワイヤーフレームの SCREEN 1 に対応。1ページのスクロールLP。

**セクション構成（上から順に）：**
1. **Header**（固定） — ロゴ + 「Book Now」ボタン（/booking へ遷移）
2. **Hero** — メインビジュアル + キャッチコピー + バッジ + CTAボタン
3. **About** — 殺陣の説明
4. **ServiceGrid** — 9つの体験カード（タップで詳細モーダル表示）
5. **SessionFlow** — 90分のタイムライン（0:00〜1:30）
6. **Pricing** — ¥40,000固定 + 含まれるもの + 決済方法（当日現地払い）
7. **AvailabilityCalendar** — 空き状況カレンダー（GAS APIからリアルタイム取得）
8. **Info** — 対応時間・人数・持ち物などのカード
9. **FAQ** — アコーディオン形式
10. **CTA** — 予約フォームへの導線
11. **Footer** — 運営情報・リンク

**空き状況カレンダー（AvailabilityCalendar）:**
- GAS WebApp から1ヶ月分の空き状況をfetchして表示
- カレンダー形式で、各日付の下に4枠（16:00/18:00/20:00/22:00）の空き状況を表示
- ステータス表示: ◎ 空きあり（緑）/ ✕ 満席（グレー）/ ✕ 休業（グレー）
- 前月・翌月ボタンでページ送り（fetchし直す）
- 満席の日はタップしても予約へ進めない
- APIエラー時は「空き状況を取得中…」表示 → フォールバックで全枠「空き」表示

**体験詳細モーダル（ServiceDetailModal）:**
- ServiceGridのカードをタップ → ボトムシートで表示
- 内容：アイコン、タイトル、画像、説明文、体験内容リスト、タグ（バッジ）
- 「この体験を含めて予約する」ボタン → /booking へ遷移（選択状態を渡す）

### ページ2: `/booking` （予約フォーム — カスタムUI 5ステップ）
ワイヤーフレームの SCREEN 2 + 3 を1ページ内のステップ形式で実装。

**ステップ構成：**
- **Step 1**: 日付選択（カレンダー + 空き状況リアルタイム表示）
- **Step 2**: 時間帯選択（16:00 / 18:00 / 20:00 / 22:00 の4枠、満席はグレーアウト）
- **Step 3**: 体験メニュー3つ選択
- **Step 4**: お客様情報入力（名前・メール・人数・部屋番号・要望）
- **Step 5**: 確認画面 + 利用規約同意チェック + 送信ボタン

**ステップ間の遷移:**
- ページ内でステートで管理（ページ遷移ではなくステップ切替）
- 上部にプログレスバー表示
- 「戻る」ボタンで前ステップに戻れる（入力内容保持）

### ページ3: `/thanks` （リクエスト完了 — SCREEN 4）
ワイヤーフレームの SCREEN 4 に対応。

**表示内容：**
- 受付完了メッセージ
- タイムライン（リクエスト受付 → 運営確認中 → 確認メール送付 → 体験当日）
- リクエスト内容サマリー
- 「24時間以内に確認メールを送信します」の注意書き
- カレンダー仮登録ボタン（.icsダウンロード）

---

## 📦 データ定義

### 9つの体験サービス（`lib/services.ts`）

```typescript
export type Service = {
  id: string;
  icon: string;
  name: string;        // 英語表示名
  nameJa: string;      // 日本語名（管理用）
  image: string;       // 画像パス
  description: string; // 英語の説明文
  details: string[];   // 体験内容リスト
  tags: string[];      // バッジ（例: "Most Popular", "Beginner OK"）
};

export const services: Service[] = [
  {
    id: 'tate',
    icon: '⚔️',
    name: 'Sword Fighting (Tate)',
    nameJa: '殺陣',
    image: '/images/tate.jpg',
    description: 'Experience the staged sword fighting seen in Japanese period dramas...',
    details: [
      'Basic sword grip and stance',
      'Drawing and sheathing technique',
      'Cutting forms (frontal cut, diagonal cut)',
      'Choreographed duel with instructor'
    ],
    tags: ['Most Popular', 'Beginner OK', '~20 min']
  },
  // ... 残り8つも同様に定義
];
```

### 予約リクエスト型

```typescript
export type BookingRequest = {
  date: string;           // "2026-03-07"
  timeSlot: string;       // "20:00-21:30"
  activities: string[];   // ["tate", "costume", "tea"] ← 3つ
  guestName: string;
  email: string;
  numberOfGuests: number; // 1〜4
  roomNumber: string;
  specialRequests?: string;
  agreedToTerms: boolean;
};
```

---

## ⚙️ バックエンド（Next.js APIルート + GAS WebApp + スプレッドシート）

### アーキテクチャ
```
[ユーザー] → [LP (Next.js / Vercel)] → [カスタム予約UI]
                  ↕
        [Next.js API Routes]
          GET /api/availability → GAS doGet → スケジュールシート読取
          POST /api/booking    → GAS doPost → シート書込 + Gmail送信
```

**Next.js APIルートがプロキシとして機能し、GAS WebAppにリクエストを転送する。**
GASがスプレッドシートへの書き込み・メール送信を一括処理する。
空き状況はGAS WebApp経由でリアルタイムにLP側に反映される。

### 詳細な実装コードは `実装指示_予約機能.md` を参照。

---

## 🎨 デザイン指針

### カラー
- **プライマリ**: 赤（#B71C1C — 侍の赤）
- **背景**: 白ベース（#FFFFFF / #FAFAFA）
- **テキスト**: ダークグレー（#333333）
- **アクセント**: ゴールド（#D4A847）控えめに使用
- **エラー**: #D32F2F
- **成功**: #2E7D32

### タイポグラフィ
- 英語見出し: Cinzel or Cormorant Garamond（Googleフォント）
- 英語本文: Inter
- 日本語フォールバック: Noto Sans JP

### レスポンシブ
- **モバイルファースト**（375px基準）
- QRコードからのアクセスが前提なのでスマホ最優先
- PCでも崩れないように最大幅を設定（max-w-lg or max-w-md で中央寄せ）

### アニメーション（任意だが推奨）
- スクロール時のフェードイン（セクションごと）
- 体験詳細モーダルのボトムシートスライドアップ
- 予約ステップ切替時のスライドアニメーション
- CTAボタンの軽いパルスアニメーション

---

## 🔧 環境変数（`.env.local`）

```
# GAS WebApp
GAS_WEBAPP_URL=https://script.google.com/macros/s/xxxxx/exec
GAS_API_KEY=sk-xxxxxxxx

# NEXT_PUBLIC_ なし（サーバーサイドAPIルートのみで使用、クライアントに漏れない）
```

---

## 📋 実装の優先順位

### Phase 1: LP表示（✅ 実装済み）
- [x] Next.js プロジェクト初期化
- [x] Tailwind CSS セットアップ
- [x] LPメインページの全セクション実装
- [x] 9つの体験詳細モーダル実装
- [x] レスポンシブ対応
- [x] Vercelにデプロイ

### Phase 2: 予約機能（★ これから実装）
- [ ] lib/ に型定義 + fetch関数
- [ ] API Route: GET /api/availability
- [ ] API Route: POST /api/booking
- [ ] LPに空き状況カレンダーを追加
- [ ] /booking ページ（5ステップ予約UI）
- [ ] /thanks ページ（完了画面 + .icsダウンロード）
- [ ] 利用規約・プライバシーポリシーページ

### Phase 3: GAS実装（★ Next.jsと並行 or 後から）
- [ ] Googleスプレッドシート作成（設計書通りの6シート）
- [ ] GAS: doGet（空き状況API）実装 + WebAppデプロイ
- [ ] GAS: doPost（予約登録 + メール送信）実装
- [ ] GAS: confirmBooking / rejectBooking 実装
- [ ] .env.local にデプロイURL設定
- [ ] テスト送信で全フロー確認

### Phase 4: 仕上げ
- [ ] OGP / メタデータ設定
- [ ] 画像の最適化（next/image使用）
- [ ] パフォーマンス最適化
- [ ] アクセシビリティチェック
- [ ] 独自ドメイン設定

---

## ⚠️ 重要な仕様メモ

1. **予約は「リクエスト」であり即時確定ではない**
   - 送信後、運営が24時間以内に対応可否を判断し確認メールを送る
   - UI上で「予約リクエスト」「確定ではありません」を明示すること

2. **決済はオンラインではなく当日現地払い**
   - Stripe等の決済UIは不要
   - 対応決済手段（現金/VISA/Master/AMEX/JCB/Apple Pay/Google Pay）をLP内と確認画面に記載

3. **ホテルは1箇所のみ**
   - ホテル選択UIは不要
   - 部屋番号のみ入力

4. **料金は¥40,000で固定**
   - 人数による変動なし（1回¥40,000、最大4名）
   - 人数セレクターは不要、テキスト入力のみ

5. **時間枠は2時間ごとに4枠**
   - 16:00-17:30 / 18:00-19:30 / 20:00-21:30 / 22:00-23:30
   - 各枠は1.5時間（90分）の体験

6. **体験は9つから3つを選択**
   - 3つ未満・4つ以上は選択不可にするバリデーション

7. **利用規約・プライバシーポリシーへの同意チェック必須**
   - 同意なしでは送信ボタンを無効化

8. **空き状況はGAS WebApp経由でリアルタイム反映**
   - LP上のカレンダーに予約済み枠・休業日を表示
   - GAS WebApp の `?action=getAvailability&month=YYYY-MM` を呼んでJSON取得
   - 予約が入る → GAS onFormSubmit がスケジュールシートを更新 → 次回LP読み込み時に反映
   - 却下された予約 → 枠が「◎」に戻る → LPで再び予約可能に
   - APIエラー時は全枠「空き」表示にフォールバック（予約受付自体は止めない）

---

## 📎 添付ファイル

- `wireframe_v3.html` — デザインの参考となるワイヤーフレーム
- `剣舞会エッジ_シート設計_final.xlsx` — スプレッドシート設計（6シート）+ GAS連携仕様（doGet/doPost完全コード付き）
- `実装指示_予約機能.md` — 予約機能の詳細実装指示（コードサンプル付き）★メイン指示書
- `画面遷移仕様.md` — 全ボタン・リンクの遷移定義
- Googleフォームは使わない。全てカスタムUIで完結
