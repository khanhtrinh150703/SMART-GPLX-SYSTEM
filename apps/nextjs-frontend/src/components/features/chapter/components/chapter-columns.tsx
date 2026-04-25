import { Chapter } from "@/components/features/chapter/types/chapter.types";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { TableColumnFactory } from "@/components/common/Generic-Table/table-column.factory";

export const getChapterColumns = (
  onEdit: (item: Chapter) => void,
  onDelete: (item: Chapter) => void,
  onRestore: (item: Chapter) => void,
  page: number,
  limit: number,
): TableColumn<Chapter>[] => [
  // 1. Gọi Variant STT
  TableColumnFactory.stt<Chapter>(page, limit),

  // 2. Cột Mã số (Mới thêm)
  {
    header: "Mã số",
    sortable: true,
    sortKey: "code",
    accessor: (item) => (
      <span className="font-mono font-medium text-slate-600">
        {item.code || "---"}
      </span>
    ),
  },

  // 3. Tên chương
  {
    header: "Tên chương",
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

  // 4. Nội dung chương
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

  // 5. Gọi Variant Trạng thái
  TableColumnFactory.status<Chapter>(),

  // 6. Gọi Variant Thao tác
  TableColumnFactory.actions<Chapter>(onEdit, onDelete, onRestore),
];