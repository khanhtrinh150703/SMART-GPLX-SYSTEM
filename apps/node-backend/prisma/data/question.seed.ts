import { IQuestionSeed } from "./interface.seed";

export const sampleQuestions: IQuestionSeed[] = [
  {
    indexNumber: 1,
    content:
      "Hành vi đưa xe cơ giới không bảo đảm tiêu chuẩn an toàn kỹ thuật vào tham gia giao thông bị nghiêm cấm không?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C", "D"],
    answers: [
      { content: "Không bị nghiêm cấm.", isCorrect: false },
      { content: "Bị nghiêm cấm.", isCorrect: true },
      { content: "Bị nghiêm cấm tuỳ từng trường hợp.", isCorrect: false },
    ],
  },
  {
    indexNumber: 2,
    content: "Cuộc đua xe chỉ được thực hiện khi nào?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B"],
    answers: [
      {
        content: "Diễn ra trên đường phố không có người qua lại.",
        isCorrect: false,
      },
      { content: "Được người dân ủng hộ.", isCorrect: false },
      { content: "Được cơ quan có thẩm quyền cấp phép.", isCorrect: true },
    ],
  },
  {
    indexNumber: 3,
    content:
      "Người lái xe không được vượt xe khác khi gặp trường hợp nào ghi dưới đây?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Trên cầu hẹp có một làn xe. Nơi đường giao nhau, đường bộ giao nhau cùng mức với đường sắt.",
        isCorrect: true,
      },
      {
        content:
          "Trên cầu có từ 02 làn xe trở lên; nơi đường bộ giao nhau không cùng mức với đường sắt.",
        isCorrect: false,
      },
      {
        content:
          "Xe được quyền ưu tiên đang phát tín hiệu ưu tiên đi làm nhiệm vụ.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 181,
    content:
      "Người lái xe có văn hóa giao thông khi điều khiển xe cơ giới tham gia giao thông đường bộ phải đáp ứng các điều kiện nào dưới đây?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      {
        content:
          "Có giấy phép lái xe phù hợp với loại xe được phép điều khiển; xe cơ giới đảm bảo tiêu chuẩn chất lượng an toàn kỹ thuật và bảo vệ môi trường.",
        isCorrect: false,
      },
      {
        content:
          "Có giấy chứng nhận bảo hiểm trách nhiệm dân sự của chủ xe cơ giới còn hiệu lực; nộp phí sử dụng đường bộ theo quy định.",
        isCorrect: false,
      },
      { content: "Cả ý 1 và ý 2.", isCorrect: true },
    ],
  },
  {
    indexNumber: 206,
    content:
      "Khi điều khiển xe trên đường vòng, khuất tầm nhìn người lái xe cần phải làm gì để đảm bảo an toàn?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["A", "B", "C", "D"],
    answers: [
      {
        content:
          "Đi đúng làn đường, đúng tốc độ quy định, không được vượt xe khác.",
        isCorrect: true,
      },
      {
        content:
          "Đi sang làn đường tàu ngược chiều để mở rộng tầm nhìn và vượt xe khác.",
        isCorrect: false,
      },
      {
        content:
          "Cho xe đi sát sang làn đường bên phải, bật tín hiệu báo hiệu để vượt xe khác.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 264,
    content:
      "Gạt nước lắp trên xe ô tô phải đảm bảo yêu cầu an toàn kỹ thuật nào dưới đây?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B", "C", "D", "BE", "CE"],
    answers: [
      {
        content: "Đầy đủ số lượng, lắp đặt chắc chắn, hoạt động bình thường.",
        isCorrect: false,
      },
      {
        content:
          "Lưỡi gạt không quá mòn, diện tích quét đảm bảo tầm nhìn của người lái.",
        isCorrect: false,
      },
      { content: "Cả ý 1 và ý 2.", isCorrect: true },
    ],
  },
  {
    indexNumber: 301,
    content:
      "Biển báo hiệu có dạng hình tròn, viền đỏ, nền trắng, trên nền có hình vẽ hoặc chữ số, chữ viết màu đen là loại biển gì dưới đây?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B", "C", "D"],
    answers: [
      { content: "Biển báo nguy hiểm.", isCorrect: false },
      { content: "Biển báo cấm.", isCorrect: true },
      { content: "Biển báo hiệu lệnh.", isCorrect: false },
      { content: "Biển báo chỉ dẫn.", isCorrect: false },
    ],
  },
  {
    indexNumber: 486,
    content: "Thứ tự các xe đi như thế nào là đúng quy tắc giao thông?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      { content: "Xe con, xe tải, xe khách.", isCorrect: false },
      { content: "Xe khách, xe con, xe tải.", isCorrect: false },
      { content: "Xe tải, xe khách, xe con.", isCorrect: true },
    ],
  },
  {
    indexNumber: 4,
    content: "Người lái xe không được quay đầu xe ở những nơi nào dưới đây?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      {
        content:
          "Ở phần đường dành cho người đi bộ qua đường, trên cầu, đầu cầu, gầm cầu vượt, trong hầm đường bộ.",
        isCorrect: true,
      },
      {
        content:
          "Ở nơi đường bộ giao nhau cùng mức với đường sắt, đường dốc, đoạn đường cong tầm nhìn bị che khuất.",
        isCorrect: false,
      },
      { content: "Cả ý 1 và ý 2.", isCorrect: false }, // Lưu ý: Câu này thực tế chọn Cả, nhưng tôi tách để Trinh test
    ],
  },
  {
    indexNumber: 5,
    content:
      "Trên đường bộ (trừ đường cao tốc) ngoài khu vực đông dân cư, loại xe nào tham gia giao thông với tốc độ tối đa cho phép là 80km/h?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["B", "C", "D"],
    answers: [
      {
        content:
          "Ô tô chở người đến 30 chỗ (trừ ô tô buýt); ô tô tải có trọng tải đến 3.500 kg.",
        isCorrect: true,
      },
      {
        content:
          "Ô tô chở người trên 30 chỗ (trừ ô tô buýt); ô tô tải có trọng tải trên 3.500 kg.",
        isCorrect: false,
      },
      {
        content: "Ô tô kéo rơ moóc; ô tô kéo xe khác; ô tô trộn bê tông.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 6,
    content:
      "Người lái xe phải giảm tốc độ thấp hơn tốc độ tối đa cho phép (có thể dừng lại một cách an toàn) trong trường hợp nào dưới đây?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      {
        content: "Khi có biển báo hiệu nguy hiểm trên đường.",
        isCorrect: true,
      },
      {
        content: "Khi qua cầu, cống hẹp; khi lên gần đỉnh dốc, khi xuống dốc.",
        isCorrect: false,
      },
      {
        content: "Khi điều khiển xe vượt xe khác trên đường thẳng.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 10,
    content:
      "Hành vi sử dụng xe máy để kéo, đẩy xe máy khác bị hết xăng đến trạm mua xăng có được phép không?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A"],
    answers: [
      {
        content: "Chỉ được thực hiện nếu đã nhìn rõ trạm xăng.",
        isCorrect: false,
      },
      { content: "Không được phép.", isCorrect: true },
      {
        content: "Được phép nếu xe bị hết xăng có khối lượng nhỏ hơn.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 182,
    content:
      "Trong các hành vi dưới đây, người lái xe ô tô có văn hóa giao thông phải ứng xử như thế nào?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["B", "C", "D"],
    answers: [
      {
        content:
          "Điều khiển xe đi bên phải theo chiều đi của mình; đi đúng làn đường, phần đường quy định; dừng, đỗ xe đúng nơi quy định.",
        isCorrect: true,
      },
      {
        content:
          "Điều khiển xe đi trên phần đường, làn đường có ít phương tiện tham gia giao thông.",
        isCorrect: false,
      },
      {
        content: "Dừng, đỗ xe ở nơi thuận tiện cho việc giao nhận hàng hóa.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 207,
    content:
      "Khi tránh nhau trên đường hẹp, người lái xe cần phải chú ý những điểm nào để đảm bảo an toàn giao thông?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["A", "B", "C"],
    answers: [
      {
        content:
          "Không nên đi cố vào đường hẹp; xe ở gần chỗ rẽ nên dừng lại nhường đường.",
        isCorrect: false,
      },
      {
        content: "Trong khi tránh nhau không nên thay đổi số.",
        isCorrect: false,
      },
      { content: "Cả ý 1 và ý 2.", isCorrect: true },
    ],
  },
  {
    indexNumber: 208,
    content:
      "Khi điều khiển xe ô tô xuống dốc dài, độ dốc cao, người lái xe cần thực hiện các thao tác nào dưới đây để đảm bảo an toàn?",
    isCritical: true,
    chapterCode: "CH03",
    licenses: ["B", "C", "D"],
    answers: [
      {
        content:
          "Tăng số cao, nhả bàn đạp ga ở mức độ phù hợp, kết hợp phanh chân để khống chế tốc độ.",
        isCorrect: false,
      },
      {
        content:
          "Về số thấp, nhả bàn đạp ga ở mức độ phù hợp, kết hợp phanh chân để khống chế tốc độ.",
        isCorrect: true,
      },
      {
        content:
          "Về số 0 (N), nhả bàn đạp ga ở mức độ phù hợp, kết hợp phanh chân để khống chế tốc độ.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 265,
    content:
      "Dây đai an toàn lắp trên xe ô tô phải đảm bảo yêu cầu an toàn kỹ thuật nào dưới đây?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B", "C", "D"],
    answers: [
      {
        content:
          "Đủ số lượng, lắp đặt chắc chắn, không bị rách đứt, khóa cài đóng mở nhẹ nhàng.",
        isCorrect: true,
      },
      {
        content: "Cơ cấu hãm giữ chặt dây khi giật dây đột ngột.",
        isCorrect: false,
      },
      { content: "Cả ý 1 và ý 2.", isCorrect: false },
    ],
  },
  {
    indexNumber: 302,
    content:
      "Biển báo hiệu có dạng hình tam giác đều, viền đỏ, nền màu vàng, trên có hình vẽ màu đen là loại biển gì dưới đây?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      { content: "Biển báo cấm.", isCorrect: false },
      { content: "Biển báo nguy hiểm.", isCorrect: true },
      { content: "Biển báo chỉ dẫn.", isCorrect: false },
    ],
  },
  {
    indexNumber: 303,
    content:
      "Biển báo hiệu có dạng hình chữ nhật hoặc hình vuông, nền xanh là loại biển gì?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      { content: "Biển báo lệnh.", isCorrect: false },
      { content: "Biển báo chỉ dẫn.", isCorrect: true },
      { content: "Biển báo phụ.", isCorrect: false },
    ],
  },
  {
    indexNumber: 487,
    content: "Xe nào được quyền ưu tiên đi trước trong trường hợp này?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      { content: "Xe cứu thương.", isCorrect: false },
      { content: "Xe quân sự.", isCorrect: true },
      { content: "Xe công an.", isCorrect: false },
    ],
  },
  {
    indexNumber: 488,
    content:
      "Khi muốn vượt xe tải, người lái xe phải làm gì là đúng quy tắc giao thông?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      {
        content:
          "Bật tín hiệu báo hiệu bằng đèn hoặc còi; khi đủ điều kiện an toàn mới được vượt.",
        isCorrect: true,
      },
      { content: "Tăng ga, nhanh chóng vượt qua.", isCorrect: false },
      { content: "Đi sát xe tải rồi mới vượt.", isCorrect: false },
    ],
  },
  {
    indexNumber: 11,
    content:
      "Người lái xe môtô xử lý như thế nào khi cho xe môtô phía sau vượt?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A"],
    answers: [
      {
        content:
          "Nếu đủ điều kiện an toàn, người lái xe phải giảm tốc độ, đi sát về bên phải của phần đường xe chạy cho đến khi xe sau đã vượt qua, không được gây trở ngại đối với xe sau vượt.",
        isCorrect: true,
      },
      {
        content: "Lái xe vào lề đường bên trái và giảm tốc độ.",
        isCorrect: false,
      },
      { content: "Tăng tốc độ và đi sát về bên phải.", isCorrect: false },
    ],
  },
  {
    indexNumber: 12,
    content:
      "Tại nơi đường giao nhau không có báo hiệu đi theo vòng xuyến, người điều khiển phương tiện phải nhường đường như thế nào là đúng quy tắc giao thông?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      {
        content: "Phải nhường đường cho xe đi đến từ bên trái.",
        isCorrect: false,
      },
      {
        content: "Phải nhường đường cho xe đi đến từ bên phải.",
        isCorrect: true,
      },
      { content: "Xe nào có tốc độ cao hơn được đi trước.", isCorrect: false },
    ],
  },
  {
    indexNumber: 183,
    content: "Khái niệm về văn hóa giao thông được hiểu như thế nào là đúng?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["A1", "B", "C"],
    answers: [
      {
        content:
          "Là sự hiểu biết và chấp hành nghiêm chỉnh pháp luật về giao thông.",
        isCorrect: false,
      },
      {
        content: "Là ý thức trách nhiệm với cộng đồng khi tham gia giao thông.",
        isCorrect: false,
      },
      { content: "Cả ý 1 và ý 2.", isCorrect: true },
    ],
  },
  {
    indexNumber: 209,
    content:
      "Để giảm tốc độ khi xe ô tô xuống dốc dài, người lái xe phải thực hiện những thao tác nào?",
    isCritical: true,
    chapterCode: "CH03",
    licenses: ["B", "C", "D"],
    answers: [
      {
        content:
          "Nhả bàn đạp ga, về số thấp (sử dụng số 1, số 2 hoặc L), đạp phanh chân với mức độ phù hợp để giảm tốc độ.",
        isCorrect: true,
      },
      { content: "Đạp phanh chân hết cỡ và tắt động cơ.", isCorrect: false },
      {
        content: "Nhả bàn đạp ga, về số 0 và đạp phanh chân.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 266,
    content:
      "Âm lượng của còi điện lắp trên xe ô tô (đo ở độ cao 1.2 mét với khoảng cách 2 mét phía trước xe) là bao nhiêu?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B", "C"],
    answers: [
      {
        content: "Không nhỏ hơn 90 dB (A), không lớn hơn 115 dB (A).",
        isCorrect: true,
      },
      {
        content: "Không nhỏ hơn 70 dB (A), không lớn hơn 90 dB (A).",
        isCorrect: false,
      },
      { content: "Không nhỏ hơn 115 dB (A).", isCorrect: false },
    ],
  },
  {
    indexNumber: 304,
    content: "Biển nào báo hiệu 'Đường cấm'?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      { content: "Biển 1 (Hình tròn nền trắng viền đỏ).", isCorrect: true },
      { content: "Biển 2 (Hình tròn nền xanh).", isCorrect: false },
      { content: "Biển 3 (Hình tam giác vàng).", isCorrect: false },
    ],
  },
  {
    indexNumber: 489,
    content: "Xe nào phải nhường đường là đúng quy tắc giao thông?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      { content: "Xe xuống dốc.", isCorrect: true },
      { content: "Xe lên dốc.", isCorrect: false },
      { content: "Xe nào to hơn phải nhường.", isCorrect: false },
    ],
  },
  {
    indexNumber: 490,
    content: "Tại ngã tư, xe nào được quyền ưu tiên đi trước?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      { content: "Xe đã vào ngã tư trước.", isCorrect: true },
      { content: "Xe ưu tiên (cứu hỏa, quân sự).", isCorrect: false }, // Nếu xe kia đã vào ngã tư thì xe kia vẫn đi trước
      { content: "Xe đi bên phải.", isCorrect: false },
    ],
  },
  {
    indexNumber: 13,
    content:
      "Người điều khiển xe môtô hai bánh, xe gắn máy có được đi dàn hàng ngang không?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A"],
    answers: [
      { content: "Không được phép.", isCorrect: true },
      { content: "Được phép nếu đường rộng.", isCorrect: false },
      { content: "Được phép đi hàng hai.", isCorrect: false },
    ],
  },
  {
    indexNumber: 14,
    content:
      "Người có giấy phép lái xe hạng A1 không được phép điều khiển loại xe nào dưới đây?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1"],
    answers: [
      { content: "Xe môtô có dung tích xi-lanh 125 cm3.", isCorrect: false },
      {
        content: "Xe môtô có dung tích xi-lanh từ 175 cm3 trở lên.",
        isCorrect: true,
      },
      { content: "Xe môtô có dung tích xi-lanh 100 cm3.", isCorrect: false },
    ],
  },
];
