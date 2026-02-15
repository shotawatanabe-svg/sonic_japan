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
