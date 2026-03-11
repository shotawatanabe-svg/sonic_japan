export type ServiceCategory = 'standard' | 'souvenir' | 'family';

export type Service = {
  id: string;
  icon: string;
  name: string;         // 英語表示名（シートの「英語名」列）
  nameJa: string;       // 日本語名（シートの「日本語名」列）
  description: string;  // 英語説明文
  details: string[];    // 体験内容リスト（配列）
  tags: string[];       // タグ（配列）
  image: string;        // 画像ファイル名（例: "tate.jpg"）
  duration: number;     // 所要時間（分）
  order: number;        // 表示順
  category: ServiceCategory; // standard / souvenir（お土産系：1つまで） / family（3枠占有）
  ageMin?: number;      // 対象年齢下限（未指定なら6歳）
  slotsRequired?: number; // 占有枠数（デフォルト1、ファミリープランは3）
};
