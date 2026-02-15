# 実装指示: GAS WebApp不要版（Google Sheets API + Googleフォーム + GASトリガー）

## 前提状況

- LPのUI（トップ + 予約フォーム5ステップ + /thanks）は実装済み
- Googleフォーム（11問: nickname + guestSizes追加）は作成済み、スプレッドシートにリンク済み
- GASコード（onFormSubmit, onEdit, 時間トリガー）は記述済み、トリガー設定前
- **GAS WebAppはデプロイしない。doGet / doPost は使わない**

---

## アーキテクチャ

```
【読み取り: 空き状況 + 体験マスタ】
  LP → Next.js API Routes → Google Sheets API (サービスアカウント) → シート直接読取
  ※ GAS不要。Vercelのサーバーから直接スプレッドシートを読む

【書き込み: 予約送信】
  LP → fetch(formResponse, {mode:'no-cors'}) → Googleフォーム → シートに自動記録
  → GAS onFormSubmit トリガー → 予約管理加工 + スケジュール更新 + メール送信
  ※ GAS WebApp不要。トリガーのみ

【メール送信】
  自動返信・運営通知:  GAS onFormSubmit トリガー
  確定・却下:          GAS onEdit トリガー（ステータス変更検知）
  アンケート:          GAS 時間トリガー（毎日9:00）
  ※ 全てGASトリガー。WebApp不要

【GAS WebApp】
  ❌ デプロイしない。doGet / doPost は不要
```

---

## Google Sheets API セットアップ手順

### Step 1: Google Cloud Console でプロジェクト作成

1. https://console.cloud.google.com/ にアクセス
2. 上部の「プロジェクトを選択」→「新しいプロジェクト」
3. プロジェクト名: `shidenryu-booking`（何でもOK）
4. 「作成」

### Step 2: Google Sheets API を有効化

1. 左メニュー「APIとサービス」→「ライブラリ」
2. 「Google Sheets API」を検索
3. クリック →「有効にする」

### Step 3: サービスアカウント作成

1. 左メニュー「APIとサービス」→「認証情報」
2. 「認証情報を作成」→「サービスアカウント」
3. サービスアカウント名: `shidenryu-reader`（何でもOK）
4. 「完了」
5. 作成されたサービスアカウントをクリック
6. 「キー」タブ →「鍵を追加」→「新しい鍵を作成」→ JSON → 「作成」
7. JSONファイルがダウンロードされる（これが認証キー）

ダウンロードしたJSONの中身はこんな形式:
```json
{
  "type": "service_account",
  "project_id": "shidenryu-booking",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEv...",
  "client_email": "shidenryu-reader@shidenryu-booking.iam.gserviceaccount.com",
  ...
}
```

### Step 4: スプレッドシートをサービスアカウントに共有

1. Googleスプレッドシートを開く
2. 右上「共有」
3. JSONの中の `client_email` の値をコピーして貼り付け
4. 権限: **閲覧者**（読み取り専用で十分）
5. 「送信」

### Step 5: 環境変数を設定

`.env.local` に以下を追加:

```env
# Google Sheets API（サービスアカウント）
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv..."
GOOGLE_SHEETS_CLIENT_EMAIL=shidenryu-reader@shidenryu-booking.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=1ABCxxxxxxxxxxxxxxxxxxxxxxxxxx

# Googleフォーム送信先（作成済み）
NEXT_PUBLIC_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/xxxxx/formResponse

# ★ 以下は削除（もう使わない）
# GAS_WEBAPP_URL=...
# GAS_API_KEY=...
```

**GOOGLE_SHEETS_SPREADSHEET_ID** の取得方法:
```
スプレッドシートのURLが
https://docs.google.com/spreadsheets/d/1ABCxxxxxxxxxx/edit
                                        ↑ この部分がID
```

**GOOGLE_SHEETS_PRIVATE_KEY** の注意:
- JSONファイルの `private_key` の値をそのままコピー
- 改行文字 `\n` はそのまま残す
- 前後を `"` で囲む（シングルクォートではなくダブルクォート）

---

## Next.js 側の実装

### パッケージ追加

```bash
npm install googleapis
```

### 追加・変更するファイル

```
lib/
├── google-sheets.ts     ★ 新規: Sheets API クライアント
├── availability.ts      ★ 書き換え: Sheets API経由に変更
├── services.ts          （型定義のみ。変更なし）
├── fetch-services.ts    ★ 書き換え: Sheets API経由に変更
└── booking.ts           （Googleフォーム送信。変更なし）

app/api/
├── availability/
│   └── route.ts         ★ 書き換え: Sheets API経由に変更
├── services/
│   └── route.ts         ★ 書き換え: Sheets API経由に変更
├── booking/
│   └── route.ts         ★ 削除（Googleフォームに移行済み）
└── revalidate/
    └── route.ts         （変更なし）
```

### lib/google-sheets.ts（★新規）

```typescript
import { google } from 'googleapis';

// サービスアカウント認証
function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID!;

// シートのデータを取得する汎用関数
export async function getSheetData(sheetName: string): Promise<string[][]> {
  const auth = getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}`,
  });

  return (res.data.values as string[][]) || [];
}
```

### app/api/availability/route.ts（★書き換え）

```typescript
import { getSheetData } from '@/lib/google-sheets';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get('month');

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return Response.json({ error: 'Invalid month format' }, { status: 400 });
  }

  try {
    const data = await getSheetData('スケジュール管理');
    const timeKeys = ['16:00', '18:00', '20:00', '22:00'];
    const result: Record<string, Record<string, string>> = {};

    // ヘッダー行をスキップ（i=1から）
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;

      // 日付をYYYY-MM-DD形式に変換
      const dateStr = normalizeDate(row[0]);
      if (!dateStr || !dateStr.startsWith(month)) continue;

      const slots: Record<string, string> = {};
      for (let j = 0; j < 4; j++) {
        const val = (row[j + 2] || '').trim();
        if (val === '◎' || val === '') {
          slots[timeKeys[j]] = 'available';
        } else if (val === '✕') {
          slots[timeKeys[j]] = 'closed';
        } else {
          slots[timeKeys[j]] = 'booked';
        }
      }
      result[dateStr] = slots;
    }

    return Response.json(
      { month, days: result },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' } }
    );
  } catch (error) {
    console.error('Sheets API error:', error);
    return Response.json({ month, days: {} }); // フォールバック
  }
}

// スプレッドシートの日付形式をYYYY-MM-DDに正規化
function normalizeDate(value: string): string | null {
  // "2026/03/07" → "2026-03-07"
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(value)) {
    return value.replace(/\//g, '-');
  }
  // "2026-03-07" そのまま
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  // その他の形式（Googleシートの日付シリアル値など）
  try {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {}
  return null;
}
```

### app/api/services/route.ts（★書き換え）

```typescript
import { getSheetData } from '@/lib/google-sheets';
import { Service } from '@/lib/services';

export async function GET() {
  try {
    const data = await getSheetData('体験マスタ');
    const services: Service[] = [];

    // ヘッダー行をスキップ（i=1から）
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;

      // K列（index 10）の有効フラグチェック
      if (String(row[10] || '').toUpperCase() !== 'TRUE') continue;

      services.push({
        id: row[0],
        icon: row[1] || '',
        nameJa: row[2] || '',
        name: row[3] || '',
        description: row[4] || '',
        details: (row[5] || '').split('\n').filter((s: string) => s.trim()),
        tags: (row[6] || '').split(',').map((s: string) => s.trim()),
        image: row[7] || '',
        duration: Number(row[8]) || 20,
        order: Number(row[9]) || 0,
      });
    }

    services.sort((a, b) => a.order - b.order);

    return Response.json(
      { services },
      { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=60' } }
    );
  } catch (error) {
    console.error('Sheets API error:', error);
    return Response.json({ services: getFallbackServices() });
  }
}

// API障害時のフォールバック
function getFallbackServices(): Service[] {
  return [
    { id: 'tate', icon: '⚔️', name: 'Sword Fighting (Tate)', nameJa: '殺陣', description: 'Experience staged sword fighting from Japanese period dramas.', details: ['Learn sword stances', 'Choreographed duel'], tags: ['Most Popular'], image: 'tate.jpg', duration: 20, order: 1 },
    { id: 'costume', icon: '🥋', name: 'Samurai Costume', nameJa: '侍着付け', description: 'Dress in authentic samurai attire.', details: ['Kimono & hakama dressing'], tags: ['Photo-friendly'], image: 'costume.jpg', duration: 20, order: 2 },
    { id: 'photo', icon: '📸', name: 'Photo Session', nameJa: '記念撮影', description: 'Professional photos in samurai gear.', details: ['Posing guidance'], tags: ['SNS-worthy'], image: 'photo.jpg', duration: 20, order: 3 },
    { id: 'tea', icon: '🍵', name: 'Tea Ceremony', nameJa: '茶道', description: 'Traditional tea ceremony in your room.', details: ['Whisking matcha'], tags: ['Zen'], image: 'tea.jpg', duration: 20, order: 4 },
    { id: 'calligraphy', icon: '✍️', name: 'Calligraphy', nameJa: '書道', description: 'Write Japanese calligraphy.', details: ['Brush technique'], tags: ['Souvenir'], image: 'calligraphy.jpg', duration: 20, order: 5 },
    { id: 'dance', icon: '🪭', name: 'Japanese Dance', nameJa: '日本舞踊', description: 'Learn traditional Japanese dance.', details: ['Fan handling'], tags: ['Elegant'], image: 'dance.jpg', duration: 20, order: 6 },
    { id: 'shuriken', icon: '🎯', name: 'Shuriken Throw', nameJa: '手裏剣', description: 'Throw shuriken at targets.', details: ['Throwing form'], tags: ['Fun!'], image: 'shuriken.jpg', duration: 20, order: 7 },
    { id: 'meditation', icon: '🧘', name: 'Meditation', nameJa: '瞑想', description: 'Samurai-style meditation.', details: ['Breathing techniques'], tags: ['Relaxing'], image: 'meditation.jpg', duration: 20, order: 8 },
    { id: 'origami', icon: '📜', name: 'Origami', nameJa: '折り紙', description: 'Create paper art.', details: ['Folding techniques'], tags: ['Souvenir'], image: 'origami.jpg', duration: 20, order: 9 },
  ];
}
```

### lib/fetch-services.ts（★書き換え）

```typescript
import { Service } from './services';

// Server Component（app/page.tsx）から呼ばれる
export async function fetchServices(): Promise<Service[]> {
  try {
    // 同じサーバー内のAPIルートを呼ぶ
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/services`, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });
    const data = await res.json();
    return data.services || [];
  } catch {
    return []; // フォールバックはAPIルート側で処理
  }
}
```

### lib/booking.ts（変更なし。確認用）

```typescript
const FORM_ACTION_URL = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL!;

const ENTRY_IDS = {
  date:            'entry.XXXXXXX', // フォームから取得したIDに置き換える
  timeSlot:        'entry.XXXXXXX',
  activity1:       'entry.XXXXXXX',
  activity2:       'entry.XXXXXXX',
  activity3:       'entry.XXXXXXX',
  nickname:        'entry.XXXXXXX',
  email:           'entry.XXXXXXX',
  numberOfGuests:  'entry.XXXXXXX',
  guestSizes:      'entry.XXXXXXX',
  roomNumber:      'entry.XXXXXXX',
  specialRequests: 'entry.XXXXXXX',
};

export type BookingData = {
  date: string;
  timeSlot: string;
  activities: string[];
  nickname: string;
  email: string;
  numberOfGuests: number;
  guestSizes: string;  // "Man-L,Woman-M" format
  roomNumber: string;
  specialRequests: string;
  agreedToTerms: boolean;
};

export async function submitBooking(data: BookingData): Promise<{ success: boolean }> {
  const formData = new FormData();
  formData.append(ENTRY_IDS.date, data.date);
  formData.append(ENTRY_IDS.timeSlot, data.timeSlot);
  formData.append(ENTRY_IDS.activity1, data.activities[0]);
  formData.append(ENTRY_IDS.activity2, data.activities[1]);
  formData.append(ENTRY_IDS.activity3, data.activities[2]);
  formData.append(ENTRY_IDS.nickname, data.nickname);
  formData.append(ENTRY_IDS.email, data.email);
  formData.append(ENTRY_IDS.numberOfGuests, String(data.numberOfGuests));
  formData.append(ENTRY_IDS.guestSizes, data.guestSizes);
  formData.append(ENTRY_IDS.roomNumber, data.roomNumber);
  formData.append(ENTRY_IDS.specialRequests, data.specialRequests || '');

  try {
    await fetch(FORM_ACTION_URL, {
      method: 'POST',
      body: formData,
      mode: 'no-cors',
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
```

### app/api/booking/route.ts → ★削除

このファイルは不要になりました。完全に削除してください。

---

## ★ 変更: LP UI (Step 2) ゲスト情報の変更

### 変更1: guestName → nickname
「Your Name」フィールドを「Nickname」に変更。

### 変更2: ゲスト数上限を4名に
numberOfGuests の選択肢を 1〜4 に制限。

### 変更3: ゲストごとの体格選択UIを追加
numberOfGuests に応じて動的にType + Sizeセレクターを表示。

```
Nickname: [John        ]
Number of guests: [2 ▼]  (max 4)

        Type           Size
Guest 1 [Man     ▼]    [L  ▼]
Guest 2 [Woman   ▼]    [M  ▼]
```

**Type の選択肢:**
- Man (Adult Male)
- Woman (Adult Female)
- Boy (Child Male)
- Girl (Child Female)

**Size の選択肢（Type が Man/Woman の場合）:**
- S (~160cm)
- M (160-170cm)
- L (170-180cm)
- XL (180cm+)

**Size の選択肢（Type が Boy/Girl の場合）:**
- Kids-S (~110cm)
- Kids-M (110-130cm)
- Kids-L (130-150cm)

TypeでBoy/Girlを選択すると、SizeがKids系に自動切替する。

**送信時のデータ結合:**
```typescript
// 各ゲストのType-Sizeをカンマ区切りで結合
const guestSizes = guests.map(g => `${g.type}-${g.size}`).join(',');
// 例: "Man-L,Woman-M"
// 例: "Man-XL,Boy-Kids-M,Girl-Kids-S"
```

### 変更4: handleSubmit の呼び出し部分

```tsx
const result = await submitBooking({
  date: booking.date!,
  timeSlot: booking.timeSlot!,
  activities: booking.activities,
  nickname: booking.nickname,        // ← guestName から変更
  email: booking.email,
  numberOfGuests: booking.numberOfGuests!,
  guestSizes: booking.guestSizes,    // ← 新規追加 (例: "Man-L,Woman-M")
  roomNumber: booking.roomNumber,
  specialRequests: booking.specialRequests,
  agreedToTerms: booking.agreedToTerms,
});
```

---

## .env.local（最終版）

```env
# Google Sheets API（サービスアカウント）
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADA..."
GOOGLE_SHEETS_CLIENT_EMAIL=shidenryu-reader@shidenryu-booking.iam.gserviceaccount.com
GOOGLE_SHEETS_SPREADSHEET_ID=1ABCxxxxxxxxxxxxxxxxxxxxxxxxxx

# Googleフォーム送信先
NEXT_PUBLIC_GOOGLE_FORM_URL=https://docs.google.com/forms/d/e/xxxxx/formResponse

# Revalidate用シークレット（任意）
REVALIDATE_SECRET=your-secret-here

# ★ 以下は削除済み（もう不要）
# GAS_WEBAPP_URL=...
# GAS_API_KEY=...
```

---

## GAS側のセットアップ

GAS WebAppはデプロイしません。トリガーだけ設定します。

### Step 1: GASコードの確認

`実装指示_Googleフォーム版.md` のGASコードが貼り付け済みであることを確認。
**ただし doGet 関数は不要になったので、残っていても害はないが使われない。**

### Step 2: トリガーの設定

GASエディタで関数選択 → `setupTriggers` → ▶ 実行

これで以下3つのトリガーが設定される:
- onFormSubmit（フォーム送信時）
- onBookingStatusChange（シート編集時）
- sendSurveyEmails（毎日9:00）

### Step 3: メールテスト

GASエディタで以下を順番に実行:
- `testAutoReplyEmail` → 自動返信メールのテスト
- `testConfirmedEmail` → 確定メールのテスト
- `testRejectedEmail` → 却下メールのテスト
- `testSurveyEmail` → アンケートメールのテスト

### 重要: GAS WebAppのデプロイは不要

「デプロイ」→「新しいデプロイ」は実行しないでください。
トリガーはWebAppデプロイなしで動きます。

---

## Vercel デプロイ時の環境変数設定

Vercel → Settings → Environment Variables に以下を追加:

| 変数名 | 値 |
|--------|---|
| `GOOGLE_SHEETS_PRIVATE_KEY` | サービスアカウントJSONの private_key 値 |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | サービスアカウントJSONの client_email 値 |
| `GOOGLE_SHEETS_SPREADSHEET_ID` | スプレッドシートのID |
| `NEXT_PUBLIC_GOOGLE_FORM_URL` | フォームの formResponse URL |
| `REVALIDATE_SECRET` | 任意のシークレット文字列 |

**注意: `GOOGLE_SHEETS_PRIVATE_KEY` について**
- Vercelの環境変数入力欄に貼り付ける際、`\n` が実際の改行に変換される場合がある
- その場合は `\n` をそのまま残す設定にするか、Vercel CLIで設定する:
  ```bash
  vercel env add GOOGLE_SHEETS_PRIVATE_KEY
  ```
  プロンプトが出たらJSONの private_key の値をそのまま貼り付ける

---

## 実装順序

```
1. npm install googleapis
2. lib/google-sheets.ts を作成
3. app/api/availability/route.ts を書き換え
4. app/api/services/route.ts を書き換え
5. app/api/booking/route.ts を削除
6. lib/fetch-services.ts を書き換え
7. lib/booking.ts の ENTRY_IDS をフォームのIDに設定
8. .env.local を更新
9. npm run dev で動作確認
```

---

## 全体テストチェックリスト

```
Google Sheets API:
  [ ] http://localhost:3001/api/availability?month=2026-03 でJSONが返る
  [ ] http://localhost:3001/api/services でJSONが返る（9件の体験データ）
  [ ] LPのカレンダーに空き状況が表示される
  [ ] LPの体験カードがスプレッドシートのデータで表示される

予約送信（Googleフォーム）:
  [ ] Step 5の送信ボタン → ローディング → /thanks へ遷移
  [ ] スプレッドシート「フォーム回答（自動）」に行が追加される

GASトリガー:
  [ ] onFormSubmit: 「予約管理」に加工済みデータが追加される
  [ ] onFormSubmit: 「スケジュール管理」の枠が BK-xxx で埋まる
  [ ] onFormSubmit: ゲストにHTMLリッチ自動返信メールが届く
  [ ] onFormSubmit: 運営にHTMLリッチ通知メールが届く
  [ ] onEdit: ステータスを「確定」→ HTMLリッチ確定メールが届く
  [ ] onEdit: ステータスを「却下」→ HTMLリッチ却下メールが届く
  [ ] onEdit: 却下後、スケジュールの枠が「◎」に戻る
  [ ] 時間トリガー: testSurveyEmail() でアンケートメールが届く

リアルタイム反映:
  [ ] 予約後 → LPのカレンダーで該当枠が「満席」に変わる（5分以内）
  [ ] 却下後 → LPのカレンダーで該当枠が「空き」に戻る

メールテンプレート:
  [ ] メールテンプレートシートの文面を変更 → 次回送信から反映される
  [ ] 体験マスタシートの変更 → 1時間以内にLPに反映される
```

---

## Cursor AIへの指示

> `実装指示_SheetsAPI版.md` を読んで実装してください。
>
> 主な変更:
> 1. `npm install googleapis` を実行
> 2. `lib/google-sheets.ts` を新規作成（Sheets API クライアント）
> 3. `app/api/availability/route.ts` を書き換え（GAS → Sheets API）
> 4. `app/api/services/route.ts` を書き換え（GAS → Sheets API）
> 5. `app/api/booking/route.ts` を削除
> 6. `lib/fetch-services.ts` を書き換え
> 7. `lib/booking.ts` を書き換え（nickname, guestSizes フィールド追加。ENTRY_IDsをフォームのIDに設定）
> 8. `.env.local` を更新（GAS_WEBAPP_URL, GAS_API_KEY を削除、Sheets API認証情報を追加）
> 9. Step 2 のゲスト情報UIを変更:
>    - guestName → nickname に変更
>    - ゲスト数上限を4名に制限
>    - ゲスト数に連動して Type(Man/Woman/Boy/Girl) + Size(S/M/L/XL/Kids-S/M/L) セレクターを動的表示
>    - 送信時にカンマ区切り結合（例: "Man-L,Woman-M"）
>
> LP のUI（Step 2 以外）、/thanks は変更しないでください。
