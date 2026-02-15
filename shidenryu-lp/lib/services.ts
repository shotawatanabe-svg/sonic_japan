export type Service = {
  id: string;
  icon: string;
  name: string;
  nameJa: string;
  image: string;
  description: string;
  details: string[];
  tags: string[];
};

export const services: Service[] = [
  {
    id: "tate",
    icon: "⚔️",
    name: "Sword Fighting (Tate)",
    nameJa: "殺陣",
    image: "/images/tate.jpg",
    description:
      "Experience the staged sword fighting seen in Japanese period dramas. Learn sword grip, drawing and sheathing techniques, and powerful cutting forms from a professional action choreographer. Finish with an epic choreographed duel!",
    details: [
      "Basic sword grip and stance",
      "Drawing and sheathing technique (Battō / Nōtō)",
      "Cutting forms (frontal cut, diagonal cut)",
      "Choreographed duel with instructor",
    ],
    tags: ["Most Popular", "Beginner OK", "~20 min"],
  },
  {
    id: "costume",
    icon: "🥋",
    name: "Samurai Costume Dressing",
    nameJa: "侍着付け",
    image: "/images/costume.jpg",
    description:
      "Dress in authentic samurai attire — kimono and hakama. Learn the dressing process while discovering the history and meaning behind each element. Wear it throughout your entire session!",
    details: [
      "Kimono & hakama dressing process",
      "Obi (belt) tying technique",
      "History of samurai attire",
      "Posture and etiquette in costume",
    ],
    tags: ["Photo-Worthy", "Beginner OK", "~20 min"],
  },
  {
    id: "photo",
    icon: "📸",
    name: "Photo Session",
    nameJa: "記念撮影",
    image: "/images/photo.jpg",
    description:
      "Get stunning photos in full samurai attire with swords and props. Our instructor guides your poses for movie-quality shots. All digital photos delivered on the spot.",
    details: [
      "Professional posing guidance",
      "Multiple scene compositions",
      "Props and dramatic staging",
      "Instant digital delivery",
    ],
    tags: ["SNS-Ready", "Everyone Joins", "~20 min"],
  },
  {
    id: "tea",
    icon: "🍵",
    name: "Tea Ceremony",
    nameJa: "茶道",
    image: "/images/tea.jpg",
    description:
      "Experience an authentic tea ceremony right in your room. Learn to whisk matcha, handle the tea bowl properly, and enjoy wagashi sweets — all while discovering the philosophy of 'ichi-go ichi-e' (one chance, one encounter).",
    details: [
      "History and philosophy of tea ceremony",
      "Whisking matcha (thin tea / Usucha)",
      "Tea bowl handling and etiquette",
      "Enjoy matcha with traditional wagashi",
    ],
    tags: ["Zen Moment", "Beginner OK", "~20 min"],
  },
  {
    id: "calligraphy",
    icon: "✍️",
    name: "Calligraphy",
    nameJa: "書道",
    image: "/images/calligraphy.jpg",
    description:
      "Write beautiful Japanese characters with brush and ink. Choose your favorite kanji or write your name in Japanese. Take your artwork home as a unique souvenir!",
    details: [
      "Brush grip and posture basics",
      "Basic stroke practice",
      "Write your chosen kanji or name",
      "Take your artwork home as a souvenir",
    ],
    tags: ["Souvenir Included", "Beginner OK", "~20 min"],
  },
  {
    id: "dance",
    icon: "🪭",
    name: "Japanese Traditional Dance",
    nameJa: "日本舞踊",
    image: "/images/dance.jpg",
    description:
      "Learn the graceful art of traditional Japanese dance. Master fan handling, elegant movements, and a short choreography to perform together with your instructor.",
    details: [
      "Fan opening and handling",
      "Basic footwork and gestures",
      "Short choreography practice",
      "Mini performance with instructor",
    ],
    tags: ["Elegant", "Popular with Women", "~20 min"],
  },
  {
    id: "shuriken",
    icon: "🎯",
    name: "Shuriken Throwing",
    nameJa: "手裏剣投げ",
    image: "/images/shuriken.jpg",
    description:
      "Learn ninja shuriken throwing techniques! Using safe rubber shuriken and a target board, master the proper form and compete for the highest score.",
    details: [
      "History and types of shuriken",
      "Proper grip and throwing form",
      "Target practice challenge",
      "Score competition (for groups)",
    ],
    tags: ["Exciting!", "Kids OK", "~20 min"],
  },
  {
    id: "meditation",
    icon: "🧘",
    name: "Samurai Meditation",
    nameJa: "瞑想",
    image: "/images/meditation.jpg",
    description:
      "Practice the mental discipline of the samurai through meditation. Learn breathing techniques and mindfulness methods used by warriors to sharpen focus and find inner peace.",
    details: [
      "Samurai mental discipline history",
      "Fundamental breathing techniques",
      "Zazen posture and mindset",
      "Guided meditation session",
    ],
    tags: ["Relaxing", "Inner Peace", "~20 min"],
  },
  {
    id: "origami",
    icon: "📜",
    name: "Origami",
    nameJa: "折り紙",
    image: "/images/origami.jpg",
    description:
      "Discover the traditional paper art of origami. Fold samurai helmets, shuriken, and other themed creations with guidance from your instructor. Take your creations home!",
    details: [
      "History and culture of origami",
      "Basic folding techniques",
      "Create a samurai helmet or shuriken",
      "Take your creations home as souvenirs",
    ],
    tags: ["Souvenir Included", "Kids OK", "~20 min"],
  },
];
