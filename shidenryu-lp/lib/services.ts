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
};
