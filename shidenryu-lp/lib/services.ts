export type ServiceCategory = 'regular' | 'souvenir' | 'family';

export type Service = {
  id: string;
  icon: string;
  name: string;         // 英語表示名（シートD列）
  nameJa: string;       // 日本語名（シートC列）
  description: string;  // 英語説明文（シートE列）
  details: string[];    // 体験内容リスト（シートF列、改行区切り）
  tags: string[];       // タグ（シートG列、カンマ区切り）
  image: string;        // 画像ファイル名（シートH列）
  duration: string;     // 所要時間（シートI列） e.g. "20 min", "20-30 min"
  order: number;        // 表示順（シートJ列）
  category: ServiceCategory; // シートL列: regular / souvenir / family
  age?: string;         // シートM列: "6+", "4+", "All ages"
};
