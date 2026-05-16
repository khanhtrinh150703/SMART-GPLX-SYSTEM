"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils/utils";
import { Cell, Pie, PieChart } from "recharts";

interface AccuracyChartProps {
  correct: number;
  wrong: number;
  unanswered: number;
  accuracyRate: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export const AccuracyChart = ({
  correct,
  wrong,
  unanswered,
  accuracyRate,
}: AccuracyChartProps) => {
  // 1. THÊM STATE MOUNTED ĐỂ CHẶN LỖI HYDRATION
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredData, setHoveredData] = useState<ChartDataItem | null>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const total = correct + wrong + unanswered;
  const isNoData = total === 0;

  const rawData: ChartDataItem[] = [
    { name: "Đúng", value: correct, color: "#10b981" }, // Emerald-500
    { name: "Sai", value: wrong, color: "#f43f5e" }, // Rose-500
    { name: "Bỏ trống", value: unanswered, color: "#cbd5e1" }, // Slate-300
  ];

  const data = isNoData
    ? [{ name: "Chưa có dữ liệu", value: 1, color: "#f1f5f9" }]
    : rawData.filter((item) => item.value > 0);

  const renderCenterContent = () => {
    if (isNoData) {
      return (
        <>
          <span className="text-3xl font-black text-slate-800 tracking-tight">
            0%
          </span>
          <span className="text-xs font-medium text-slate-400 mt-0.5">
            Độ chính xác
          </span>
        </>
      );
    }

    if (hoveredData) {
      return (
        <>
          <span
            className="text-3xl font-black tracking-tight"
            style={{ color: hoveredData.color }}
          >
            {hoveredData.value}
          </span>
          <span className="text-xs font-medium text-slate-500 mt-0.5">
            {hoveredData.name}
          </span>
        </>
      );
    }

    return (
      <>
        <span className="text-3xl font-black text-slate-800 tracking-tight">
          {accuracyRate}%
        </span>
        <span className="text-xs font-medium text-slate-400 mt-0.5">
          Độ chính xác
        </span>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
      {/* Cụm Biểu đồ */}
      <div className="relative w-[180px] h-[180px] shrink-0 flex items-center justify-center">
        {/* 2. CHỈ RENDER CHART KHI ĐÃ XUỐNG CLIENT ĐỂ KHÔNG BỊ LỖI -1 */}
        {isMounted ? (
          <PieChart width={180} height={180}>
            <Pie
              data={data}
              innerRadius={65}
              outerRadius={85}
              paddingAngle={isNoData ? 0 : 5}
              dataKey="value"
              stroke="none"
              className="outline-none"
              onMouseEnter={(_, index) => {
                if (!isNoData && data[index]) setHoveredData(data[index]);
              }}
              onMouseLeave={() => setHoveredData(null)}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className={cn(
                    "outline-none transition-all duration-300",
                    !isNoData && "hover:opacity-80 cursor-pointer",
                  )}
                />
              ))}
            </Pie>
          </PieChart>
        ) : (
          // Khung chờ (Skeleton) giữ nguyên kích thước để không bị giật giao diện
          <div className="w-[170px] h-[170px] rounded-full border-[20px] border-slate-50" />
        )}

        {/* Tâm biểu đồ */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300">
          {renderCenterContent()}
        </div>
      </div>

      {/* Cụm Chi tiết Số liệu */}
      <div className="flex flex-col w-full gap-3">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2 mb-1">
          Thống kê chi tiết
        </div>

        <LegendRow
          color="bg-emerald-500"
          label="Đúng"
          value={correct}
          total={total}
        />
        <LegendRow
          color="bg-rose-500"
          label="Sai"
          value={wrong}
          total={total}
        />
        <LegendRow
          color="bg-slate-300"
          label="Bỏ trống"
          value={unanswered}
          total={total}
        />

        <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100 font-bold text-slate-800">
          <span className="text-sm">Tổng câu hỏi</span>
          <span className="text-lg">{total}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// Sub-Components
// ============================================================================

interface LegendRowProps {
  color: string;
  label: string;
  value: number;
  total: number;
}

function LegendRow({ color, label, value, total }: LegendRowProps) {
  const percentage = total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="flex items-center justify-between w-full group">
      <div className="flex items-center gap-2.5">
        <div className={cn("w-3 h-3 rounded-full shadow-sm", color)} />
        <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium text-slate-400 w-8 text-right">
          {percentage}%
        </span>
        <span className="text-base font-bold text-slate-800 w-6 text-right">
          {value}
        </span>
      </div>
    </div>
  );
}
