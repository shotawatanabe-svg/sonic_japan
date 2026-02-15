import { Service } from './services';

export async function fetchServices(): Promise<Service[]> {
  const gasUrl = process.env.GAS_WEBAPP_URL;

  if (!gasUrl) {
    console.warn('GAS_WEBAPP_URL is not configured – using fallback services');
    return getFallbackServices();
  }

  try {
    const url = `${gasUrl}?action=getServices`;
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1時間キャッシュ
    });

    if (!res.ok) {
      throw new Error(`GAS responded with ${res.status}`);
    }

    const data = await res.json();
    const services: Service[] = data.services || [];

    if (services.length === 0) {
      console.warn('GAS returned empty services – using fallback');
      return getFallbackServices();
    }

    // 表示順でソート
    return services.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return getFallbackServices();
  }
}

// GASに繋がらない場合の最低限のフォールバック
function getFallbackServices(): Service[] {
  return [
    { id: 'tate', icon: '⚔️', name: 'Sword Fighting (Tate)', nameJa: '殺陣', description: 'Experience staged sword fighting from Japanese period dramas.', details: ['Learn sword stances', 'Practice cutting forms', 'Choreographed duel'], tags: ['Most Popular', 'Beginner OK'], image: 'tate.jpg', duration: 20, order: 1 },
    { id: 'costume', icon: '🥋', name: 'Samurai Costume', nameJa: '侍着付け', description: 'Dress in authentic samurai attire.', details: ['Kimono & hakama dressing', 'History of samurai attire'], tags: ['Photo-friendly'], image: 'costume.jpg', duration: 20, order: 2 },
    { id: 'photo', icon: '📸', name: 'Photo Session', nameJa: '記念撮影', description: 'Professional photos in samurai gear.', details: ['Posing guidance', 'Multiple setups'], tags: ['SNS-worthy'], image: 'photo.jpg', duration: 20, order: 3 },
    { id: 'tea', icon: '🍵', name: 'Tea Ceremony', nameJa: '茶道', description: 'Traditional tea ceremony in your room.', details: ['Whisking matcha', 'Tea bowl etiquette'], tags: ['Zen'], image: 'tea.jpg', duration: 20, order: 4 },
    { id: 'calligraphy', icon: '✍️', name: 'Calligraphy', nameJa: '書道', description: 'Write Japanese calligraphy with brush and ink.', details: ['Brush technique', 'Write your name'], tags: ['Souvenir'], image: 'calligraphy.jpg', duration: 20, order: 5 },
    { id: 'dance', icon: '🪭', name: 'Japanese Dance', nameJa: '日本舞踊', description: 'Learn traditional Japanese dance basics.', details: ['Fan handling', 'Basic choreography'], tags: ['Elegant'], image: 'dance.jpg', duration: 20, order: 6 },
    { id: 'shuriken', icon: '🎯', name: 'Shuriken Throw', nameJa: '手裏剣', description: 'Throw shuriken at targets.', details: ['Throwing form', 'Target challenge'], tags: ['Fun!', 'Kids OK'], image: 'shuriken.jpg', duration: 20, order: 7 },
    { id: 'meditation', icon: '🧘', name: 'Meditation', nameJa: '瞑想', description: 'Samurai-style meditation and breathing.', details: ['Breathing techniques', 'Guided meditation'], tags: ['Relaxing'], image: 'meditation.jpg', duration: 20, order: 8 },
    { id: 'origami', icon: '📜', name: 'Origami', nameJa: '折り紙', description: 'Create paper art with samurai themes.', details: ['Folding techniques', 'Make a kabuto helmet'], tags: ['Souvenir', 'Kids OK'], image: 'origami.jpg', duration: 20, order: 9 },
  ];
}
