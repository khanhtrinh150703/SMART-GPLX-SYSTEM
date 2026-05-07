"use client";

import { useMemo, useState, useEffect, useCallback, useDeferredValue, useRef } from "react"; // 1. Thêm useDeferredValue
import { UseFormSetValue } from "react-hook-form";
import { ICreateManualExamDTO } from "../types/exam.types";
import { IExamQuestionSummary } from "@/components/features/question/types/question-summary.types";

export function useManualExamLogic(
    pool: IExamQuestionSummary[],
    initialQuestionIds: string[],
    setValue: UseFormSetValue<ICreateManualExamDTO>
) {
    // --- 1. TRẠNG THÁI CHỌN CÂU HỎI ---
    const [selectedIds, setSelectedIds] = useState<string[]>(initialQuestionIds);
    const [lastClickedId, setLastClickedId] = useState<string | null>(null);
    const stateRef = useRef({ selectedIds, filteredPool: pool, lastClickedId });

    useEffect(() => {
        setSelectedIds(initialQuestionIds);
    }, [initialQuestionIds]);

    useEffect(() => {
        stateRef.current = { selectedIds, filteredPool: pool, lastClickedId };
    }); // Chạy sau mỗi lần render để cập nhật dữ liệu mới nhất vào Ref
    const handleSetSelection = useCallback((ids: string[]) => {
        setSelectedIds(ids);
        setValue("questionIds", ids, { shouldValidate: true });
    }, [setValue]);


    // --- 2. LOGIC LỌC DỮ LIỆU (TỐI ƯU SỐ 1) ---
    const [searchTerm, setSearchTerm] = useState("");

    /**
     * 🌟 TỐI ƯU: Trì hoãn giá trị tìm kiếm.
     * Khi bạn gõ, searchTerm thay đổi ngay để input mượt, 
     * nhưng deferredSearchTerm sẽ đợi một nhịp CPU rảnh mới cập nhật.
     */
    const deferredSearchTerm = useDeferredValue(searchTerm);

    const [selectedChapters, setSelectedChapters] = useState<string[]>([]);
    const [selectedLicenses, setSelectedLicenses] = useState<string[]>([]);
    const [onlyCritical, setOnlyCritical] = useState(false);

    const normalizeString = (str: string) => {
        return str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "d")
            .trim();
    };

    const chapters = useMemo(() => {
        return Array.from(new Set(pool.map((q) => q.chapterName).filter(Boolean)))
            .sort((a, b) => a.localeCompare(b, "vi"));
    }, [pool]);

    const licenseCategories = useMemo(() => {
        return Array.from(new Set(pool.flatMap((q) => q.licenseCategoryNames || [])))
            .sort((a, b) => a.localeCompare(b, "en"));
    }, [pool]);

    /**
     * 🌟 BỘ LỌC TỔNG HỢP: Sử dụng deferredSearchTerm thay vì searchTerm
     */
    const filteredPool = useMemo(() => {
        // Sử dụng giá trị trì hoãn ở đây
        const searchKey = normalizeString(deferredSearchTerm);

        return pool.filter((question) => {
            const matchesSearch =
                !searchKey ||
                normalizeString(question.content).includes(searchKey) ||
                question.indexNumber.toString().includes(searchKey);
            if (!matchesSearch) return false;

            const matchesChapter =
                selectedChapters.length === 0 ||
                selectedChapters.includes(question.chapterName);
            if (!matchesChapter) return false;

            const matchesLicense =
                selectedLicenses.length === 0 ||
                (question.licenseCategoryNames || []).some((l) =>
                    selectedLicenses.includes(l)
                );
            if (!matchesLicense) return false;

            const matchesCritical = !onlyCritical || question.isCritical;
            if (!matchesCritical) return false;

            return true;
        });
    }, [pool, deferredSearchTerm, selectedChapters, selectedLicenses, onlyCritical]);

    // Toggle logic cho Shift + Click (Sử dụng filteredPool đã được trì hoãn)
    const toggleQuestion = useCallback((question: IExamQuestionSummary, isShift: boolean = false) => {
        // Lấy dữ liệu mới nhất từ Ref thay vì từ State
        const { selectedIds: currentSelected, filteredPool: currentPool, lastClickedId: currentLastId } = stateRef.current;
        const id = question.id;

        if (isShift && currentLastId) {
            const startIdx = currentPool.findIndex((q) => q.id === currentLastId);
            const endIdx = currentPool.findIndex((q) => q.id === id);

            if (startIdx !== -1 && endIdx !== -1) {
                const rangeIds = currentPool
                    .slice(Math.min(startIdx, endIdx), Math.max(startIdx, endIdx) + 1)
                    .map((q) => q.id);

                const newIds = Array.from(new Set([...currentSelected, ...rangeIds]));
                handleSetSelection(newIds);
                setLastClickedId(id);
                return;
            }
        }

        const newIds = currentSelected.includes(id)
            ? currentSelected.filter((i) => i !== id)
            : [...currentSelected, id];

        handleSetSelection(newIds);
        setLastClickedId(id);
    }, [handleSetSelection]);

    // --- 3. THỐNG KÊ (ÁP DỤNG TỐI ƯU SỐ 3: DÙNG SET) ---
    const stats = useMemo(() => {
        // Chuyển sang Set để truy vấn O(1) thay vì O(n) bên trong filter
        const idSet = new Set(selectedIds);
        const selected = pool.filter((q) => idSet.has(q.id));

        const groupedSelected = selected.reduce((acc, q) => {
            const chapter = q.chapterName || "Chương khác";
            if (!acc[chapter]) acc[chapter] = [];
            acc[chapter].push(q);
            return acc;
        }, {} as Record<string, IExamQuestionSummary[]>);

        return {
            count: selected.length,
            criticalCount: selected.filter((q) => q.isCritical).length,
            groupedSelected,
        };
    }, [pool, selectedIds]);
    const clearAllFilters = useCallback(() => {
        setSearchTerm("");
        setSelectedChapters([]);
        setSelectedLicenses([]);
        setOnlyCritical(false);
    }, []); // Thêm cái này để hàm không bị tạo lại
    return {
        selectedIds,
        toggleQuestion,
        handleReorder: handleSetSelection,
        onClearSelection: () => handleSetSelection([]),
        filteredPool,
        chapters,
        licenseCategories,
        searchTerm, // Vẫn trả về searchTerm gốc cho ô Input
        setSearchTerm,
        selectedChapters,
        selectedLicenses,
        onlyCritical,
        setSelectedChapters,
        setSelectedLicenses,
        setOnlyCritical,
        clearAllFilters,
        ...stats,
    };
}