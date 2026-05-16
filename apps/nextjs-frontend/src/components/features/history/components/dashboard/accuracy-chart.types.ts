import { SectorProps } from "recharts";

/**
 * @interface ChartData
 * Dữ liệu cho từng phần của biểu đồ (Data for each chart segment)
 */
export interface ChartData {
  name: string;
  value: number;
  color: string;
  key: string;
}

/**
 * @interface ActiveShapeProps
 * Kế thừa SectorProps để đảm bảo tương thích với Recharts
 * (Inherits SectorProps to ensure compatibility with Recharts)
 */
export interface ActiveShapeProps extends SectorProps {
  payload?: ChartData; // Dữ liệu đính kèm (Attached data)
}

/**
 * @interface AccuracyChartProps
 * Thuộc tính đầu vào cho Component biểu đồ
 * (Input props for the Chart Component)
 */
export interface AccuracyChartProps {
  correct: number;    // Số câu đúng (Correct count)
  wrong: number;      // Số câu sai (Wrong count)
  unanswered: number; // Số câu bỏ trống (Unanswered count)
  accuracyRate: number; // Tỉ lệ chính xác (Accuracy rate)
}