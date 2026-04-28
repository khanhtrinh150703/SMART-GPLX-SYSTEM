export interface FilterOption {
  value: string;
  label: string;
}

export interface QuestionFilterForm {
  chapterId: string;
  licenseCategoryIds: string;
  difficultyLevel: string;
  isCritical: string;
  indexNumber: string;
}

export interface QuestionFilterProps {
  isOpen: boolean;
  layout?: "grid" | "sidebar" | "compact";
  chapterOptions: FilterOption[];
  licenseOptions: FilterOption[];
  difficultyOptions: FilterOption[];
  filterForm: QuestionFilterForm;
  // Sử dụng Partial để cập nhật một hoặc nhiều field cùng lúc
  onFilterChange: (updates: Partial<QuestionFilterForm>) => void;
  onApply: () => void;
  onClear: () => void;
  onClose: () => void;
}