import { getSheetData } from '@/lib/google-sheets';
import type { Service } from '@/lib/services';

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

      const category = (row[11] || 'standard') as 'standard' | 'souvenir' | 'family';
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
        category,
        ageMin: row[12] ? Number(row[12]) : undefined,
        slotsRequired: row[13] ? Number(row[13]) : undefined,
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
    { id: 'sword', icon: '⚔️', name: 'Sword Assembly & Paper Cutting', nameJa: '刀組み立て実演・半紙切り体験', description: 'Watch a live sword assembly demonstration and try cutting Japanese paper with a real technique.', details: ['Live sword assembly demonstration by a master', 'Try cutting traditional Japanese paper (hanshi)', 'Learn the art behind Japanese swordcraft'], tags: ['Most Popular'], image: 'sword.jpg', duration: 20, order: 1, category: 'standard' },
    { id: 'dance', icon: '🪭', name: 'Japanese Dance & Parlor Games', nameJa: '日本舞踊体験・お座敷遊び体験', description: 'Learn graceful movements of traditional Japanese dance and enjoy classic parlor games.', details: ['Learn traditional Japanese dance movements', 'Experience authentic ozashiki asobi (parlor games)', 'Enjoy cultural entertainment guided by a professional'], tags: ['Elegant'], image: 'dance.jpg', duration: 20, order: 2, category: 'standard' },
    { id: 'costume', icon: '🥋', name: 'Samurai Costume & Photo', nameJa: 'サムライコスチューム着付け体験・撮影', description: 'Be dressed in full samurai attire and have a professional photo session.', details: ['Full samurai costume fitting by a professional dresser', 'Professional photo session in costume', 'Choose from multiple authentic costume styles'], tags: ['Photo-friendly'], image: 'costume.jpg', duration: 20, order: 3, category: 'standard' },
    { id: 'tea', icon: '🍵', name: 'Tea Ceremony', nameJa: '茶道体験', description: 'Experience an intimate tea ceremony led by a certified tea master.', details: ['Learn the ritualized preparation of matcha', 'Understand the philosophy of ichi-go ichi-e', 'Enjoy traditional Japanese sweets paired with tea'], tags: ['Zen'], image: 'tea.jpg', duration: 25, order: 4, category: 'standard' },
    { id: 'zen', icon: '🧘', name: 'Zen Experience', nameJa: '禅体験', description: 'Practice Zen meditation and breathing techniques to center your mind and body.', details: ['Guided breathing exercises rooted in Zen tradition', 'Learn seiza posture and mindful presence', 'Experience a moment of deep calm'], tags: ['Relaxing'], image: 'zen.jpg', duration: 15, order: 5, category: 'standard' },
    { id: 'calligraphy', icon: '✍️', name: 'Calligraphy', nameJa: '書道体験', description: 'Write beautiful Japanese characters with brush and ink, guided by a calligraphy master.', details: ['Learn proper brush technique and posture', 'Write your name in Japanese characters', 'Take home your calligraphy as a souvenir'], tags: ['Creative'], image: 'calligraphy.jpg', duration: 20, order: 6, category: 'standard', ageMin: 4 },
    { id: 'kurumi', icon: '🌰', name: 'Walnut Button Strap', nameJa: '和風くるみボタンストラップ作り', description: 'Create a beautiful Japanese-style walnut button strap as a unique handmade souvenir.', details: ['Choose your favorite fabric design', 'Craft a walnut button strap with guidance', 'Take home a one-of-a-kind handmade souvenir'], tags: ['Souvenir'], image: 'kurumi.jpg', duration: 25, order: 7, category: 'souvenir' },
    { id: 'tsumami', icon: '🌸', name: 'Tsumami Craft Brooch / Strap', nameJa: 'つまみ細工ブローチorストラップ作り', description: 'Create a delicate tsumami-zaiku (fabric flower) brooch or strap using traditional techniques.', details: ['Learn the traditional tsumami-zaiku technique', 'Create a flower brooch or strap', 'Take home your handcrafted piece'], tags: ['Souvenir'], image: 'tsumami.jpg', duration: 25, order: 8, category: 'souvenir' },
    { id: 'mizuhiki', icon: '🎀', name: 'Mizuhiki Strap Making', nameJa: '水引ストラップ作り', description: 'Create a beautiful mizuhiki (decorative cord) strap using traditional Japanese knotting.', details: ['Learn traditional mizuhiki knotting techniques', 'Create a unique decorative strap', 'Take home your handmade mizuhiki piece'], tags: ['Souvenir'], image: 'mizuhiki.jpg', duration: 25, order: 9, category: 'souvenir' },
    { id: 'family', icon: '👨‍👩‍👧‍👦', name: 'Family Plan', nameJa: '【ファミリープラン】写真撮影＋先生の習字＋アートボード', description: 'A special family package: cosplay photo session, calligraphy by a master, and an art board — all in one! All ages welcome, no participant limit.', details: ['Cosplay photo session for the whole family', 'Calligraphy artwork by a professional teacher', 'Create a memorable art board together'], tags: ['Family', 'All Ages'], image: 'family.jpg', duration: 60, order: 10, category: 'family', ageMin: 0, slotsRequired: 3 },
  ];
}
