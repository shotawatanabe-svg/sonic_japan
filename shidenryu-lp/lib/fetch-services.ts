import { getSheetData } from './google-sheets';
import type { Service } from './services';

// Server Component（app/page.tsx）から直接呼ばれる
// ※ 自分のAPIルートをfetchするのはNext.jsのアンチパターンなので
//    Google Sheets APIを直接呼び出す
export async function fetchServices(): Promise<Service[]> {
  try {
    const data = await getSheetData('体験マスタ');
    const services: Service[] = [];

    // ヘッダー行をスキップ（i=1から）
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue;

      // K列（index 10）の有効フラグチェック
      if (String(row[10] || '').toUpperCase() !== 'TRUE') continue;

      const category = (row[11] || 'regular') as 'regular' | 'souvenir' | 'family';
      services.push({
        id: row[0],
        icon: row[1] || '',
        nameJa: row[2] || '',
        name: row[3] || '',
        description: row[4] || '',
        details: (row[5] || '').split('\n').filter((s: string) => s.trim()),
        tags: (row[6] || '').split(',').map((s: string) => s.trim()),
        image: row[7] || '',
        duration: String(row[8] || '20 min'),
        order: Number(row[9]) || 0,
        category,
        age: row[12] ? String(row[12]) : undefined,
      });
    }

    services.sort((a, b) => a.order - b.order);
    return services;
  } catch (error) {
    console.error('fetchServices error:', error);
    return getFallbackServices();
  }
}

// Google Sheets API障害時のフォールバック（10体験）
function getFallbackServices(): Service[] {
  return [
    { id: 'sword_assembly', icon: '⚔️', name: 'Sword Assembly & Paper Cutting', nameJa: '刀組み立て実演・半紙切り体験', description: '(Description coming soon)', details: ['Live sword assembly demonstration by a master', 'Try cutting traditional Japanese paper (hanshi)', 'Learn the art behind Japanese swordcraft'], tags: ['Most Popular'], image: 'sword.jpg', duration: '20 min', order: 1, category: 'regular' },
    { id: 'japanese_dance', icon: '🪭', name: 'Japanese Dance & Ozashiki Games', nameJa: '日本舞踊体験・お座敷遊び体験', description: '(Description coming soon)', details: ['Learn traditional Japanese dance movements', 'Experience authentic ozashiki asobi (parlor games)', 'Enjoy cultural entertainment guided by a professional'], tags: ['Elegant'], image: 'dance.jpg', duration: '20 min', order: 2, category: 'regular' },
    { id: 'samurai_costume', icon: '🥋', name: 'Samurai Costume & Photo', nameJa: 'サムライコスチューム着付け体験・撮影', description: '(Description coming soon)', details: ['Full samurai costume fitting by a professional dresser', 'Professional photo session in costume', 'Choose from multiple authentic costume styles'], tags: ['Photo-friendly'], image: 'costume.jpg', duration: '20 min', order: 3, category: 'regular' },
    { id: 'tea_ceremony', icon: '🍵', name: 'Tea Ceremony', nameJa: '茶道体験', description: '(Description coming soon)', details: ['Learn the ritualized preparation of matcha', 'Understand the philosophy of ichi-go ichi-e', 'Enjoy traditional Japanese sweets paired with tea'], tags: ['Zen'], image: 'tea.jpg', duration: '20-30 min', order: 4, category: 'regular' },
    { id: 'zen', icon: '🧘', name: 'Zen Meditation', nameJa: '禅体験', description: '(Description coming soon)', details: ['Guided breathing exercises rooted in Zen tradition', 'Learn seiza posture and mindful presence', 'Experience a moment of deep calm'], tags: ['Relaxing'], image: 'zen.jpg', duration: '10-20 min', order: 5, category: 'regular' },
    { id: 'calligraphy', icon: '✍️', name: 'Calligraphy', nameJa: '書道体験', description: '(Description coming soon)', details: ['Learn proper brush technique and posture', 'Write your name in Japanese characters', 'Take home your calligraphy as a souvenir'], tags: ['Creative'], image: 'calligraphy.jpg', duration: '20 min', order: 6, category: 'regular', age: '4+' },
    { id: 'kurumi_button', icon: '🎀', name: 'Japanese Walnut Button Strap', nameJa: '和風くるみボタンストラップ作り', description: '(Description coming soon)', details: ['Choose your favorite fabric design', 'Craft a walnut button strap with guidance', 'Take home a one-of-a-kind handmade souvenir'], tags: ['Souvenir'], image: 'kurumi.jpg', duration: '20-30 min', order: 7, category: 'souvenir' },
    { id: 'tsumami_craft', icon: '🌸', name: 'Tsumami Craft Brooch / Strap', nameJa: 'つまみ細工ブローチorストラップ作り', description: '(Description coming soon)', details: ['Learn the traditional tsumami-zaiku technique', 'Create a flower brooch or strap', 'Take home your handcrafted piece'], tags: ['Souvenir'], image: 'tsumami.jpg', duration: '20-30 min', order: 8, category: 'souvenir' },
    { id: 'mizuhiki', icon: '🎗️', name: 'Mizuhiki Strap Making', nameJa: '水引ストラップ作り', description: '(Description coming soon)', details: ['Learn traditional mizuhiki knotting techniques', 'Create a unique decorative strap', 'Take home your handmade mizuhiki piece'], tags: ['Souvenir'], image: 'mizuhiki.jpg', duration: '20-30 min', order: 9, category: 'souvenir' },
    { id: 'family_plan', icon: '👨‍👩‍👧‍👦', name: 'Family Plan: Photo + Calligraphy + Art Board', nameJa: '【ファミリープラン】写真撮影＋先生の習字＋アートボード', description: '(Description coming soon)', details: ['Cosplay photo session for the whole family', 'Calligraphy artwork by a professional teacher', 'Create a memorable art board together'], tags: ['Family', 'All Ages'], image: 'family.jpg', duration: '60-70 min', order: 10, category: 'family', age: 'All ages' },
  ];
}
