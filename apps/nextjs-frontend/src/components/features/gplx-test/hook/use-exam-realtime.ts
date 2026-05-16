// src/features/gplx-test/hooks/use-exam-realtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
// Giả định bạn có một socket instance
// import { socket } from "@/lib/socket";

// export const useExamRealtime = () => {
//   const queryClient = useQueryClient();

//   useEffect(() => {
//     // Lắng nghe sự kiện "NEW_EXAM_CREATED" (Có đề thi mới) từ Backend
//     const handleNewExam = () => {
//       // Vô hiệu hóa Cache (Invalidate Cache) để React Query tự động tải lại danh sách
//       queryClient.invalidateQueries({
//         queryKey: ["exams", "visual"], // Sẽ bắt được cả infinite và list thường
//       });
//     };

//     // socket.on("NEW_EXAM_CREATED", handleNewExam);

//     // Cleanup function: Xóa Listener khi component unmount để tránh Memory Leak (Rò rỉ bộ nhớ)
//     return () => {
//       // socket.off("NEW_EXAM_CREATED", handleNewExam);
//     };
//   }, [queryClient]);
// };

export const useExamRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleNewExam = () => {
      // Đánh dấu toàn bộ cache liên quan là cũ (Stale)
      queryClient.invalidateQueries({
        queryKey: ["exams", "visual"],
        exact: false, // Quan trọng: Để bắt được cả mảng key con
      });

      // Ép buộc refetch ngay lập tức cho các query đang hiển thị
      // (Force immediate refetch for active queries)
      queryClient.refetchQueries({
        queryKey: ["exams", "visual"],
        type: "active",
      });
    };

    // socket.on("NEW_EXAM_CREATED", handleNewExam);
    // return () => socket.off("NEW_EXAM_CREATED", handleNewExam);
  }, [queryClient]);
};
