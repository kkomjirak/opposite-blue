export interface PortfolioImage {
  index: number;
  filename: string;
  relative_path: string;
  absolute_path: string;
  original_filename?: string | null;
  url: string;
  width?: number;
  height?: number;
  format?: string;
  size_kb?: number;
  error?: string;
}

export interface PortfolioItem {
  id: number;
  title: string;
  category: '웹사이트' | '배너 디자인' | '컨텐츠 디자인' | '인쇄물 디자인' | string;
  date: string;
  author: string;
  url: string;
  cms?: string | null;
  status?: string | null;
  live_link?: string | null;
  production_date?: string | null;
  text_lines: string[];
  images: PortfolioImage[];
}

export type CategoryFilter = '전체' | '웹사이트' | '배너 디자인' | '컨텐츠 디자인' | '인쇄물 디자인';
