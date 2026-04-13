import { Chapter } from "@/types/chapter.types";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { TableColumnFactory } from "@/components/common/Generic-Table/table-column.factory";

export const getChapterColumns = (
  onEdit: (item: Chapter) => void,
  onDelete: (item: Chapter) => void,
  onRestore: (item: Chapter) => void,
  page: number,
  limit: number,
): TableColumn<Chapter>[] => [
  // Gọi Variant STT
  TableColumnFactory.stt<Chapter>(page, limit),

  {
    header: "Tên chương chương",
    sortable: true,
    sortKey: "name",
    accessor: (item) => (
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[300px]">
          {item.name}
        </span>
      </div>
    ),
  },
  {
    header: "Nội dung chương",
    sortable: true,
    sortKey: "description",
    accessor: (item) => (
      <div className="flex flex-col gap-1">
        <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[300px]">
          {item.description}
        </span>
      </div>
    ),
  },

  // Gọi Variant Trạng thái (Tự động map màu & chữ)
  TableColumnFactory.status<Chapter>(),

  // Gọi Variant Thao tác (Tự động xử lý logic icon & màu)
  TableColumnFactory.actions<Chapter>(onEdit, onDelete, onRestore),
];
