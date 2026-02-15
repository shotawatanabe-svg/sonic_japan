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
| フォーム送信 | メール通知（Resend or Nodemailer）※後述 |
| DB（任意） | Vercel KV or Supabase（予約データ保存する場合） |
| アニメーション | Framer Motion（任意） |

---

## 📁 ディレクトリ構成（推奨）

```
shidenryu-lp/
├── app/
│   ├── layout.tsx          # 共通レイアウト（フォント・メタデータ）
│   ├── page.tsx            # LPメインページ（SCREEN 1）
│   ├── booking/
│   │   └── page.tsx        # 予約フォームページ（SCREEN 2 → 3）
│   ├── thanks/
│   │   └── page.tsx        # リクエスト完了ページ（SCREEN 4）
│   └── api/
│       └── booking/
│           └── route.ts    # 予約リクエストAPI
├── components/
│   ├── Header.tsx          # 固定ヘッダー
│   ├── Hero.tsx            # ファーストビュー
│   ├── About.tsx           # サービス紹介
│   ├── ServiceGrid.tsx     # 9つの体験カード一覧
│   ├── ServiceDetailModal.tsx  # 体験詳細ボトムシート
│   ├── SessionFlow.tsx     # 90分の体験フロー
│   ├── Pricing.tsx         # 料金セクション
│   ├── Info.tsx            # 基本情報カード
│   ├── FAQ.tsx             # よくある質問（アコーディオン）
│   ├── CTASection.tsx      # 予約導線CTA
│   ├── Footer.tsx          # フッター
│   ├── Calendar.tsx        # 日付選択カレンダー
│   ├── TimeSlots.tsx       # 時間帯選択
│   ├── ActivityPicker.tsx  # 体験3つ選択UI
│   ├── GuestForm.tsx       # お客様情報フォーム
│   ├── ConfirmSection.tsx  # 確認画面
│   └── ProgressBar.tsx     # 予約ステップ進捗バー
├── lib/
│   ├── services.ts         # 9つの体験のデータ定義
│   └── send-email.ts       # メール送信ロジック
├── public/
│   └── images/             # 各体験の写真素材
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
7. **Info** — 対応時間・人数・持ち物などのカード
8. **FAQ** — アコーディオン形式
9. **CTA** — 予約フォームへの導線
10. **Footer** — 運営情報・リンク

**体験詳細モーダル（ServiceDetailModal）:**
- ServiceGridのカードをタップ → ボトムシートで表示
- 内容：アイコン、タイトル、画像、説明文、体験内容リスト、タグ（バッジ）
- 「この体験を含めて予約する」ボタン → /booking へ遷移（選択状態を渡す）

### ページ2: `/booking` （予約フォーム — SCREEN 2 → 3）
ワイヤーフレームの SCREEN 2 + 3 を1ページ内のステップ形式で実装。

**ステップ構成：**
- **Step 1**: 日付選択（カレンダー）
- **Step 2**: 時間帯選択（16:00 / 18:00 / 20:00 / 22:00 の4枠）
- **Step 3**: 体験メニュー3つ選択
- **Step 4**: お客様情報入力（名前・メール・人数・部屋番号・要望）
- **Step 5**: 確認画面 + 同意チェック + 送信ボタン

**ステップ間の遷移:**
- ページ内でステートで管理（ページ遷移ではなくステップ切替）
- 上部にプログレスバー表示
- 「戻る」ボタンで前ステップに戻れる

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

## ⚙️ API仕様

### POST `/api/booking`

**リクエスト:** BookingRequest のJSON

**処理:**
1. バリデーション
   - activities が 3つであること
   - numberOfGuests が 1〜4であること
   - agreedToTerms が true であること
   - email のフォーマットチェック
   - timeSlot が "16:00-17:30" / "18:00-19:30" / "20:00-21:30" / "22:00-23:30" のいずれか
2. 運営者へメール通知（Resend or Nodemailer）
   - 宛先: 運営用メールアドレス（環境変数 `ADMIN_EMAIL`）
   - 内容: 予約リクエストの全情報
3. ゲストへ自動返信メール
   - 宛先: リクエスト者のメールアドレス
   - 内容: 「リクエストを受け付けました。24時間以内に確認メールをお送りします。」
4. （任意）DBに保存

**レスポンス:** `{ success: true, bookingId: "xxx" }`

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
# メール送信（Resend使用の場合）
RESEND_API_KEY=re_xxxxxxxxxxxx
ADMIN_EMAIL=admin@example.com
FROM_EMAIL=noreply@shidenryu.com

# （任意）DB
DATABASE_URL=xxxxx
```

---

## 📋 実装の優先順位

### Phase 1: LP表示（まずここを完成させる）
- [ ] Next.js プロジェクト初期化（`npx create-next-app@latest`）
- [ ] Tailwind CSS セットアップ
- [ ] LPメインページの全セクション実装
- [ ] 9つの体験詳細モーダル実装
- [ ] レスポンシブ対応
- [ ] Vercelにデプロイして表示確認

### Phase 2: 予約フォーム
- [ ] /booking ページのステップUI実装
- [ ] カレンダーコンポーネント実装
- [ ] 時間帯選択（4枠: 16:00/18:00/20:00/22:00）
- [ ] 体験3つ選択UI
- [ ] フォーム入力 + バリデーション
- [ ] 確認画面 + 利用規約同意チェック

### Phase 3: API & メール通知
- [ ] /api/booking エンドポイント実装
- [ ] Resend（or 代替）でメール送信
- [ ] /thanks ページ実装
- [ ] .icsカレンダーファイル生成

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

---

## 📎 添付ファイル

- `wireframe_v3.html` — デザインの参考となるワイヤーフレーム（HTMLで開いて確認可能）
- このファイルのUIレイアウト・配色・フローをベースに実装してください
