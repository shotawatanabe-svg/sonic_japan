import type { Service } from './services';

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
