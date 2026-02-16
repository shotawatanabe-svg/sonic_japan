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
    return services;
  } catch (error) {
    console.error('fetchServices error:', error);
    return getFallbackServices();
  }
}

// Google Sheets API障害時のフォールバック（9体験）
function getFallbackServices(): Service[] {
  return [
    { id: 'tate', icon: '⚔️', name: 'Sword Fighting (Tate)', nameJa: '殺陣', description: 'Learn the art of staged sword combat from professional performers who have appeared in samurai films and stage productions.', details: ['Learn authentic sword stances and footwork', 'Perform a choreographed duel with a master', 'Understand the philosophy of the samurai through movement'], tags: ['Most Popular'], image: 'tate.jpg', duration: 20, order: 1 },
    { id: 'costume', icon: '🥋', name: 'Samurai Costume', nameJa: '侍着付け', description: 'Be dressed in full samurai attire — kimono, hakama, and accessories — by a professional dresser.', details: ['Full kimono and hakama dressing by an expert', 'Choose from multiple authentic costume styles', 'Learn the meaning behind each piece of samurai attire'], tags: ['Photo-friendly'], image: 'costume.jpg', duration: 20, order: 2 },
    { id: 'photo', icon: '📸', name: 'Photo Session', nameJa: '記念撮影', description: 'Get professional photos taken in full samurai gear with guided posing by our experienced photographer.', details: ['Professional lighting and composition', 'Multiple poses with sword and fan props', 'Digital photos delivered to your email'], tags: ['SNS-worthy'], image: 'photo.jpg', duration: 20, order: 3 },
    { id: 'tea', icon: '🍵', name: 'Tea Ceremony', nameJa: '茶道', description: 'Experience an intimate tea ceremony led by a certified tea master, right in your hotel room.', details: ['Learn the ritualized preparation of matcha', 'Understand the philosophy of ichi-go ichi-e (one encounter, one chance)', 'Enjoy traditional Japanese sweets paired with your tea'], tags: ['Zen'], image: 'tea.jpg', duration: 20, order: 4 },
    { id: 'calligraphy', icon: '✍️', name: 'Calligraphy', nameJa: '書道', description: 'Write beautiful Japanese characters with brush and ink, guided by a calligraphy master.', details: ['Learn proper brush technique and posture', 'Write your name in Japanese characters', 'Take home your calligraphy as a unique souvenir'], tags: ['Souvenir'], image: 'calligraphy.jpg', duration: 20, order: 5 },
    { id: 'dance', icon: '🪭', name: 'Japanese Dance', nameJa: '日本舞踊', description: 'Learn graceful movements of traditional Japanese dance from a professional Nihon Buyo performer.', details: ['Master fan handling and elegant gestures', 'Learn a short choreography to traditional music', 'Understand the storytelling expressed through dance'], tags: ['Elegant'], image: 'dance.jpg', duration: 20, order: 6 },
    { id: 'shuriken', icon: '🎯', name: 'Shuriken Throw', nameJa: '手裏剣', description: 'Test your aim by throwing real rubber shuriken at a target board, ninja-style!', details: ['Learn the proper throwing form used by ninja', 'Practice with safe rubber shuriken', 'Compete with your group for the best score'], tags: ['Fun!'], image: 'shuriken.jpg', duration: 20, order: 7 },
    { id: 'meditation', icon: '🧘', name: 'Meditation', nameJa: '瞑想', description: 'Practice samurai-style meditation and breathing techniques to center your mind and body.', details: ['Guided breathing exercises rooted in Zen tradition', 'Learn seiza posture and mindful presence', 'Experience a moment of deep calm after the action-packed activities'], tags: ['Relaxing'], image: 'meditation.jpg', duration: 20, order: 8 },
    { id: 'origami', icon: '📜', name: 'Origami', nameJa: '折り紙', description: 'Create intricate paper art using traditional Japanese folding techniques.', details: ['Learn to fold classic designs: crane, samurai helmet, and more', 'Understand the cultural significance of origami in Japan', 'Take your creations home as souvenirs'], tags: ['Souvenir'], image: 'origami.jpg', duration: 20, order: 9 },
  ];
}
