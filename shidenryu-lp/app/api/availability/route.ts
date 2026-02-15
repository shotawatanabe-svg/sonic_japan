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
  } catch { /* ignore */ }
  return null;
}
