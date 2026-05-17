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
      { content: "Cả ý 1 và ý 2.", isCorrect: false }, 
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
  {
    indexNumber: 2,
    content: "Cuộc đua xe chỉ được thực hiện khi nào?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
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
    indexNumber: 4,
    content:
      "Ở phần đường dành cho người đi bộ qua đường, trên cầu, đầu cầu, đường cao tốc, đường hẹp, đường dốc, tại nơi đường bộ giao nhau cùng mức với đường sắt có được quay đầu xe hay không?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Được phép.", isCorrect: false },
      { content: "Không được phép.", isCorrect: true },
      { content: "Tùy từng trường hợp.", isCorrect: false },
    ],
  },
  {
    indexNumber: 5,
    content:
      "Người điều khiển xe mô tô hai bánh, ba bánh, xe gắn máy có được phép sử dụng xe để kéo hoặc đẩy các phương tiện khác khi tham gia giao thông không?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A"],
    answers: [
      { content: "Được phép.", isCorrect: false },
      {
        content: "Nếu phương tiện được kéo có khối lượng nhỏ hơn xe mình.",
        isCorrect: false,
      },
      { content: "Không được phép.", isCorrect: true },
    ],
  },
  {
    indexNumber: 6,
    content:
      "Khi điều khiển xe chạy trên đường, người lái xe phải mang theo các loại giấy tờ gì?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Giấy phép lái xe phù hợp với loại xe đó; Giấy chứng nhận đăng ký xe; Giấy chứng nhận kiểm định kỹ thuật và bảo vệ môi trường, Giấy chứng nhận bảo hiểm trách nhiệm dân sự của chủ xe cơ giới.",
        isCorrect: true,
      },
      {
        content:
          "Giấy phép lái xe phù hợp với loại xe đó; Lệnh vận chuyển; Bản sao giấy chứng nhận đăng ký xe có xác nhận của ngân hàng.",
        isCorrect: false,
      },
      {
        content:
          "Giấy chứng nhận đăng ký xe; Giấy chứng nhận bảo hiểm trách nhiệm dân sự của chủ xe cơ giới; Giấy chứng nhận sức khỏe.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 7,
    content:
      "Biển báo hiệu có dạng hình tròn, viền đỏ, nền trắng, trên nền có hình vẽ hoặc chữ số, chữ viết màu đen là loại biển gì dưới đây?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Biển báo nguy hiểm.", isCorrect: false },
      { content: "Biển báo cấm.", isCorrect: true },
      { content: "Biển báo hiệu lệnh.", isCorrect: false },
      { content: "Biển báo chỉ dẫn.", isCorrect: false },
    ],
  },
  {
    indexNumber: 8,
    content:
      "Khi có tín hiệu của xe ưu tiên, người tham gia giao thông phải làm gì?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Nhanh chóng tăng tốc độ, tránh sang đường để nhường đường cho xe ưu tiên.",
        isCorrect: false,
      },
      {
        content: "Dừng xe ngay lập tức giữa đường để nhường đường.",
        isCorrect: false,
      },
      {
        content:
          "Nhanh chóng giảm tốc độ, tránh hoặc dừng lại sát lề đường bên phải để nhường đường; không được gây cản trở xe được quyền ưu tiên.",
        isCorrect: true,
      },
    ],
  },
  {
    indexNumber: 9,
    content:
      "Tại nơi đường giao nhau không có báo hiệu đi theo vòng xuyến, người điều khiển phương tiện phải nhường đường như thế nào là đúng quy tắc giao thông?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Phải nhường đường cho xe đi đến từ bên phải.",
        isCorrect: true,
      },
      {
        content: "Xe báo hiệu xin đường trước được đi trước.",
        isCorrect: false,
      },
      {
        content: "Phải nhường đường cho xe đi đến từ bên trái.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 10,
    content:
      "Trên đường bộ (trừ đường cao tốc) trong khu vực đông dân cư, đường đôi có dải phân cách giữa, xe mô tô hai bánh, ô tô chở người đến 30 chỗ tham gia giao thông với tốc độ tối đa cho phép là bao nhiêu?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B"],
    answers: [
      { content: "60 km/h.", isCorrect: true },
      { content: "50 km/h.", isCorrect: false },
      { content: "40 km/h.", isCorrect: false },
    ],
  },

  // --- CH02: Văn hóa giao thông và đạo đức người lái xe ---
  {
    indexNumber: 181,
    content:
      "Người lái xe cố tình vi phạm Luật giao thông đường bộ, gây tai nạn giao thông rồi bỏ chạy để trốn tránh trách nhiệm hoặc cố ý không cứu giúp người bị tai nạn giao thông thì bị xử lý như thế nào?",
    isCritical: true,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Không bị xử lý hình sự.", isCorrect: false },
      { content: "Bị xử lý theo quy định của pháp luật.", isCorrect: true },
      { content: "Chỉ bị xử phạt hành chính.", isCorrect: false },
    ],
  },
  {
    indexNumber: 182,
    content:
      "Trong các hành vi dưới đây, người lái xe ô tô có văn hóa giao thông phải ứng xử như thế nào?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["B1", "B", "C"],
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
        content:
          "Dừng xe, đỗ xe ở nơi thuận tiện cho việc chuyên chở hành khách và hàng hóa.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 183,
    content:
      "Khi xảy ra tai nạn giao thông, người lái xe và người có mặt tại hiện trường vụ tai nạn phải thực hiện các công việc gì dưới đây?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Đặt biển cảnh báo hoặc vật báo hiệu ở phía trước và phía sau hiện trường xảy ra tai nạn để cảnh báo; kiểm tra tình trạng thương tích của người bị nạn và sơ cứu giúp người bị nạn; báo tin ngay cho cơ quan chức năng.",
        isCorrect: true,
      },
      {
        content:
          "Nhanh chóng lái xe gây tai nạn hoặc nhờ xe khác ra khỏi hiện trường vụ tai nạn.",
        isCorrect: false,
      },
      { content: "Cả ý 1 và ý 2.", isCorrect: false },
    ],
  },
  {
    indexNumber: 184,
    content:
      "Khi sơ cứu người bị tai nạn giao thông đường bộ có vết thương chảy máu ngoài màu đỏ thẫm, trào ra sát mép vết thương và chảy chậm, người sơ cứu cần làm gì?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Thực hiện cầm máu trực tiếp.", isCorrect: true },
      {
        content: "Thực hiện cầm máu bằng gạc (ép động mạch).",
        isCorrect: false,
      },
      { content: "Thực hiện cầm máu bằng dây garô.", isCorrect: false },
    ],
  },

  // --- CH03: Kỹ thuật lái xe ---
  {
    indexNumber: 206,
    content:
      "Khi quay đầu xe, người lái xe cần phải quan sát và thực hiện thao tác nào để đảm bảo an toàn giao thông?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Quan sát biển báo hiệu để biết nơi được phép quay đầu; quan sát kỹ địa hình nơi chọn để quay đầu; lựa chọn quỹ đạo quay đầu xe cho thích hợp; quay đầu xe với tốc độ thấp; thường xuyên báo tín hiệu cho các phương tiện khác biết.",
        isCorrect: true,
      },
      {
        content:
          "Quay đầu xe với tốc độ tối đa để nhanh chóng thoát khỏi nơi giao nhau.",
        isCorrect: false,
      },
      {
        content:
          "Nếu quay đầu xe ở nơi nguy hiểm thì đưa đầu xe về phía nguy hiểm, đuôi xe về phía an toàn.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 207,
    content:
      "Khi xuống dốc cao, người lái xe ô tô số tự động cần thực hiện các thao tác nào để đảm bảo an toàn?",
    isCritical: true,
    chapterCode: "CH03",
    licenses: ["B1", "B"],
    answers: [
      {
        content:
          "Về số thấp (sử dụng lẫy chuyển số hoặc chế độ số tay), phối hợp phanh chân để khống chế tốc độ.",
        isCorrect: true,
      },
      {
        content: "Về số N (số mo), thả trôi xe và đạp phanh khi cần thiết.",
        isCorrect: false,
      },
      { content: "Tắt máy và thả trôi xe xuống dốc.", isCorrect: false },
    ],
  },
  {
    indexNumber: 208,
    content:
      "Khi điều khiển ô tô tới gần xe chạy ngược chiều vào ban đêm, người lái xe cần thực hiện thao tác nào để đảm bảo an toàn?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Chuyển từ đèn chiếu xa sang đèn chiếu gần; không nhìn thẳng vào đèn của xe chạy ngược chiều mà nhìn chếch sang phía phải theo chiều chuyển động của xe mình.",
        isCorrect: true,
      },
      {
        content:
          "Chuyển từ đèn chiếu gần sang đèn chiếu xa để quan sát rõ hơn.",
        isCorrect: false,
      },
      {
        content:
          "Bật đèn pha thật sáng để xe ngược chiều biết xe mình đang tới.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 209,
    content:
      "Khi tránh nhau trên đường hẹp, người lái xe cần chú ý những điểm nào để đảm bảo an toàn?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Không nên đi cố vào đường hẹp; xe ở gần chỗ lẩn hơn nên vào vị trí lẩn, nhường đường cho xe kia đi; trong khi tránh nhau không nên đổi số; khi tránh nhau ban đêm phải tắt đèn pha bật đèn cốt.",
        isCorrect: true,
      },
      { content: "Xe nào có tốc độ cao hơn thì đi trước.", isCorrect: false },
      {
        content: "Xe xuống dốc không cần nhường đường cho xe lên dốc.",
        isCorrect: false,
      },
    ],
  },

  // --- CH04: Cấu tạo và sửa chữa ---
  {
    indexNumber: 264,
    content:
      "Gạt nước lắp trên ô tô phải đảm bảo yêu cầu kỹ thuật nào dưới đây?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B1", "B", "C"],
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
    indexNumber: 265,
    content:
      "Âm lượng của còi điện lắp trên ô tô (đo ở độ cao 1,2 m với khoảng cách 2 m từ đầu xe) là bao nhiêu?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B1", "B", "C"],
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
    indexNumber: 266,
    content:
      "Mục đích của bảo dưỡng thường xuyên đối với xe ô tô có tác dụng gì dưới đây?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Làm cho ô tô luôn có tính năng kỹ thuật tốt, giảm cực nhọc cho người lái, ngăn ngừa và phát hiện kịp thời các hư hỏng.",
        isCorrect: false,
      },
      { content: "Giữ gìn hình thức bên ngoài.", isCorrect: false },
      { content: "Cả ý 1 và ý 2.", isCorrect: true },
    ],
  },
  {
    indexNumber: 267,
    content:
      "Khi kiểm tra mức dầu bôi trơn của động cơ (qua thước thăm dầu), mức dầu nên nằm ở đâu?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B1", "B", "C"],
    answers: [
      { content: "Dưới mức Min.", isCorrect: false },
      { content: "Trên mức Max.", isCorrect: false },
      { content: "Giữa mức Min và Max.", isCorrect: true },
    ],
  },

  // --- CH05: Báo hiệu đường bộ ---
  {
    indexNumber: 301,
    content: "Biển nào báo hiệu 'Đường cấm'?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Biển 1 (Hình tròn nền đỏ, không hình vẽ).", isCorrect: true },
      { content: "Biển 2 (Hình tròn nền trắng, viền đỏ).", isCorrect: false },
      { content: "Biển 3 (Hình tam giác vàng).", isCorrect: false },
    ],
  },
  {
    indexNumber: 302,
    content: "Biển nào báo hiệu 'Giao nhau với đường ưu tiên'?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Biển 1 (Hình tam giác thuận).", isCorrect: false },
      { content: "Biển 2 (Hình tam giác ngược).", isCorrect: true },
      { content: "Biển 3 (Hình thoi).", isCorrect: false },
    ],
  },
  {
    indexNumber: 303,
    content: "Khi gặp biển nào thì xe mô tô hai bánh được đi vào?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A"],
    answers: [
      { content: "Biển 1 (Cấm ô tô).", isCorrect: true },
      { content: "Biển 2 (Cấm mô tô).", isCorrect: false },
      { content: "Biển 3 (Cấm xe tải).", isCorrect: false },
    ],
  },
  {
    indexNumber: 304,
    content:
      "Vạch kẻ đường nào dưới đây là vạch phân chia hai chiều xe chạy (vạch tim đường)?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Vạch màu vàng.", isCorrect: true },
      { content: "Vạch màu trắng.", isCorrect: false },
      { content: "Vạch màu xanh.", isCorrect: false },
    ],
  },

  // --- CH06: Giải thế sa hình và xử lý tình huống ---
  {
    indexNumber: 486,
    content:
      "Thứ tự các xe đi như thế nào là đúng quy tắc giao thông? (Giả định: Xe chữa cháy, xe quân sự, xe công an, xe cứu thương cùng xuất hiện)",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Xe chữa cháy -> Xe quân sự, Xe công an -> Xe cứu thương.",
        isCorrect: true,
      },
      {
        content: "Xe quân sự -> Xe chữa cháy -> Xe công an -> Xe cứu thương.",
        isCorrect: false,
      },
      {
        content: "Xe công an -> Xe quân sự -> Xe chữa cháy -> Xe cứu thương.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 487,
    content:
      "Xe nào được quyền đi trước trong trường hợp này? (Xe con rẽ phải, xe tải đi thẳng, xe khách rẽ trái tại ngã tư không có biển báo)",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Xe con (Vì rẽ phải).", isCorrect: true },
      { content: "Xe tải (Vì đi thẳng).", isCorrect: false },
      { content: "Xe khách (Vì rẽ trái).", isCorrect: false },
    ],
  },
  {
    indexNumber: 488,
    content:
      "Trong hình dưới đây, những xe nào vi phạm quy tắc giao thông? (Giả định: Xe mô tô đi vào làn đường dành cho ô tô có biển chỉ dẫn làn đường)",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Xe mô tô.", isCorrect: true },
      { content: "Xe ô tô con.", isCorrect: false },
      { content: "Tất cả các loại xe trên.", isCorrect: false },
    ],
  },
  {
    indexNumber: 489,
    content:
      "Bạn xử lý như thế nào khi xe phía trước đang lùi ra khỏi điểm đỗ?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Chờ xe phía trước lùi xong rồi mới đi tiếp.",
        isCorrect: true,
      },
      { content: "Bấm còi liên tục để họ dừng lại.", isCorrect: false },
      { content: "Tăng tốc độ để vượt qua thật nhanh.", isCorrect: false },
    ],
  },
  {
    indexNumber: 11,
    content: "Khái niệm 'đường bộ' được hiểu như thế nào là đúng?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Đường, cầu đường bộ, hầm đường bộ, bến phà đường bộ.",
        isCorrect: true,
      },
      {
        content: "Đường, cầu đường bộ, dải phân cách, đường ngầm.",
        isCorrect: false,
      },
      {
        content: "Đường bộ, hành lang an toàn đường bộ, lưới điện cao áp.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 12,
    content: "Khái niệm 'phần đường xe chạy' được hiểu như thế nào là đúng?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Là phần của đường bộ được sử dụng cho các phương tiện giao thông qua lại.",
        isCorrect: true,
      },
      {
        content:
          "Là phần đường bộ được giới hạn bằng vạch kẻ đường để xe chạy.",
        isCorrect: false,
      },
      {
        content: "Là phần đường dành riêng cho xe ô tô và xe máy.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 13,
    content: "Khái niệm 'làn đường' được hiểu như thế nào là đúng?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Là một phần của phần đường xe chạy được chia theo chiều dọc của đường, có bề rộng đủ cho xe chạy an toàn.",
        isCorrect: true,
      },
      {
        content:
          "Là một phần của phần đường xe chạy được chia theo chiều ngang của đường, có bề rộng cho xe chạy.",
        isCorrect: false,
      },
      {
        content: "Là đường dành riêng cho các loại xe cơ giới lưu thông.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 14,
    content:
      "Hành vi điều khiển xe cơ giới chạy quá tốc độ quy định, giành đường, vượt ẩu có bị nghiêm cấm không?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Bị nghiêm cấm.", isCorrect: true },
      { content: "Không bị nghiêm cấm.", isCorrect: false },
      {
        content: "Bị nghiêm cấm tùy từng trường hợp cụ thể.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 15,
    content:
      "Người điều khiển phương tiện giao thông đường bộ mà trong cơ thể có chất ma túy có bị nghiêm cấm không?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Bị nghiêm cấm.", isCorrect: true },
      { content: "Không bị nghiêm cấm.", isCorrect: false },
      { content: "Nghiêm cấm tùy thuộc vào nồng độ ma túy.", isCorrect: false },
    ],
  },
  {
    indexNumber: 16,
    content:
      "Hành vi giao xe cơ giới, xe máy chuyên dùng cho người không đủ điều kiện để điều khiển xe tham gia giao thông có bị nghiêm cấm không?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Không bị nghiêm cấm.", isCorrect: false },
      { content: "Bị nghiêm cấm.", isCorrect: true },
      { content: "Bị nghiêm cấm tùy từng trường hợp.", isCorrect: false },
    ],
  },
  {
    indexNumber: 17,
    content:
      "Hành vi sản xuất, mua bán, sử dụng biển số xe cơ giới, xe máy chuyên dùng được quy định như thế nào trong Luật Giao thông đường bộ?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Được phép sản xuất, mua bán khi có nhu cầu.",
        isCorrect: false,
      },
      {
        content: "Nghiêm cấm sản xuất, mua bán, sử dụng trái phép.",
        isCorrect: true,
      },
      {
        content: "Được phép sử dụng biển số do mình tự làm.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 18,
    content:
      "Khi gặp hiệu lệnh của người điều khiển giao thông giơ tay thẳng đứng, người tham gia giao thông phải đi như thế nào?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Người tham gia giao thông ở tất cả các hướng phải dừng lại (trừ các xe đã ở trong khu vực giao nhau).",
        isCorrect: true,
      },
      {
        content:
          "Người tham gia giao thông ở phía trước và phía sau được đi tiếp.",
        isCorrect: false,
      },
      {
        content:
          "Người tham gia giao thông ở bên phải và bên trái được đi tiếp.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 19,
    content:
      "Khi gặp hiệu lệnh của người điều khiển giao thông dang ngang hai tay, người tham gia giao thông phải đi như thế nào?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Người tham gia giao thông ở phía trước và phía sau được đi tiếp.",
        isCorrect: false,
      },
      {
        content:
          "Người tham gia giao thông ở phía trước và phía sau phải dừng lại; người tham gia giao thông ở phía bên phải và bên trái được đi.",
        isCorrect: true,
      },
      { content: "Tất cả các hướng phải dừng lại.", isCorrect: false },
    ],
  },
  {
    indexNumber: 20,
    content:
      "Tại nơi đường giao nhau có báo hiệu đi theo vòng xuyến, người điều khiển phương tiện phải nhường đường như thế nào?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Phải nhường đường cho xe đi đến từ bên trái.",
        isCorrect: true,
      },
      {
        content: "Phải nhường đường cho xe đi đến từ bên phải.",
        isCorrect: false,
      },
      {
        content: "Xe nào có tốc độ nhanh hơn thì được đi trước.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 21,
    content:
      "Tại nơi đường bộ giao nhau cùng mức với đường sắt chỉ có đèn tín hiệu hoặc chuông báo hiệu, khi đèn tín hiệu màu đỏ đã bật sáng hoặc có tiếng chuông báo hiệu, người tham gia giao thông phải dừng lại ngay và giữ khoảng cách tối thiểu bao nhiêu mét tính từ ray gần nhất?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "5,00 m.", isCorrect: true },
      { content: "3,00 m.", isCorrect: false },
      { content: "4,00 m.", isCorrect: false },
    ],
  },
  {
    indexNumber: 22,
    content:
      "Người lái xe phải giảm tốc độ thấp hơn tốc độ tối đa cho phép đến mức cần thiết trong trường hợp nào dưới đây?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Khi có biển báo hiệu nguy hiểm hoặc có chướng ngại vật trên đường; khi chuyển hướng xe chạy hoặc tầm nhìn bị hạn chế.",
        isCorrect: true,
      },
      {
        content: "Khi qua cầu vượt, đường cao tốc không có chướng ngại vật.",
        isCorrect: false,
      },
      {
        content: "Khi điều khiển xe vượt xe khác trên đường vắng.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 23,
    content:
      "Tác dụng của mũ bảo hiểm đối với người đi xe mô tô hai bánh khi xảy ra tai nạn giao thông là gì?",
    isCritical: false,
    chapterCode: "CH01",
    licenses: ["A1", "A"],
    answers: [
      { content: "Để làm đẹp và che nắng.", isCorrect: false },
      { content: "Để giảm thiểu chấn thương vùng đầu.", isCorrect: true },
      { content: "Để tránh bị Cảnh sát giao thông xử phạt.", isCorrect: false },
    ],
  },
  {
    indexNumber: 24,
    content:
      "Người điều khiển xe mô tô hai bánh, xe gắn máy không được thực hiện những hành vi nào dưới đây?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A"],
    answers: [
      {
        content:
          "Đi xe dàn hàng ngang; đi xe vào phần đường dành cho người đi bộ và phương tiện khác; sử dụng ô, điện thoại di động, thiết bị âm thanh.",
        isCorrect: true,
      },
      {
        content: "Chở người bệnh đi cấp cứu; chở trẻ em dưới 14 tuổi.",
        isCorrect: false,
      },
      {
        content:
          "Bật đèn tín hiệu trước khi chuyển hướng rẽ phải hoặc rẽ trái.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 25,
    content:
      "Khi điều khiển xe trên đường cao tốc, người lái xe cần tuân thủ điều nào dưới đây?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Chỉ được dừng xe, đỗ xe ở nơi quy định; nếu buộc phải dừng xe, đỗ xe không đúng nơi quy định thì phải đưa xe ra khỏi phần đường xe chạy.",
        isCorrect: true,
      },
      {
        content: "Được phép quay đầu xe, lùi xe khi đi quá lối ra.",
        isCorrect: false,
      },
      {
        content: "Được phép chạy xe ở làn dừng khẩn cấp để vượt xe khác.",
        isCorrect: false,
      },
    ],
  },

  // --- CH02: Văn hóa giao thông, đạo đức người lái xe... (6 câu) ---
  {
    indexNumber: 185,
    content: "Khái niệm 'Văn hóa giao thông' được hiểu như thế nào là đúng?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Là sự hiểu biết và chấp hành nghiêm chỉnh pháp luật về giao thông; là ý thức trách nhiệm với cộng đồng khi tham gia giao thông.",
        isCorrect: true,
      },
      {
        content:
          "Là cách ứng xử có văn hóa, tình yêu thương con người trong các tình huống xảy ra trên đường.",
        isCorrect: false,
      },
      { content: "Cả ý 1 và ý 2 đều đúng.", isCorrect: true },
    ],
  },
  {
    indexNumber: 186,
    content:
      "Người có văn hóa giao thông khi điều khiển xe cơ giới tham gia giao thông đường bộ phải đảm bảo điều kiện gì?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Có giấy phép lái xe phù hợp với loại xe điều khiển; xe có đăng ký và bảo đảm tiêu chuẩn an toàn kỹ thuật.",
        isCorrect: true,
      },
      {
        content:
          "Đi xe tùy ý theo sở thích cá nhân, không cần quan tâm đến phương tiện khác.",
        isCorrect: false,
      },
      {
        content: "Chỉ cần mang theo giấy tờ tùy thân là đủ.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 187,
    content:
      "Trong đô thị, người lái xe buýt, xe taxi phải thực hiện nét văn hóa nào dưới đây?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Đón trả khách đúng nơi quy định; nhường đường cho các phương tiện khác và người đi bộ qua đường.",
        isCorrect: true,
      },
      {
        content:
          "Tranh giành khách, bấm còi liên tục để hối thúc các xe phía trước.",
        isCorrect: false,
      },
      {
        content:
          "Chạy xe vào làn đường dành cho xe gắn máy để trả khách nhanh chóng.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 188,
    content:
      "Khi xảy ra tai nạn giao thông, hành vi nào dưới đây bị nghiêm cấm?",
    isCritical: true,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Xâm phạm tính mạng, sức khỏe, tài sản của người bị nạn và người gây tai nạn; bỏ trốn sau khi gây tai nạn để trốn tránh trách nhiệm.",
        isCorrect: true,
      },
      {
        content:
          "Sơ cứu người bị tai nạn khi cơ quan y tế chưa đến hiện trường.",
        isCorrect: false,
      },
      {
        content: "Bảo vệ tài sản của người bị nạn và hiện trường vụ tai nạn.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 189,
    content:
      "Khi sơ cứu người bị tai nạn giao thông đường bộ có vết thương chảy máu ngoài phun thành tia và phun mạnh khi mạch đập, người sơ cứu phải làm gì?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Thực hiện cầm máu bằng dây garô hoặc ép động mạch.",
        isCorrect: true,
      },
      {
        content: "Chỉ cần lau sạch vết thương và để thoáng.",
        isCorrect: false,
      },
      {
        content: "Đắp các loại lá cây dân gian lên vết thương.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 190,
    content:
      "Hành vi gây gổ, ẩu đả hoặc đe dọa người khác sau khi xảy ra va chạm giao thông có vi phạm đạo đức người lái xe không?",
    isCritical: true,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Vi phạm nghiêm trọng đạo đức và văn hóa giao thông.",
        isCorrect: true,
      },
      {
        content: "Không vi phạm vì đó là phản ứng tâm lý bình thường.",
        isCorrect: false,
      },
      {
        content: "Được phép nếu mình là người đi đúng luật.",
        isCorrect: false,
      },
    ],
  },

  // --- CH03: Kỹ thuật lái xe (11 câu) ---
  {
    indexNumber: 210,
    content:
      "Khi mở cửa xe ô tô từ bên trong ra, người lái xe cần thực hiện thao tác nào để đảm bảo an toàn?",
    isCritical: true,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Quan sát gương chiếu hậu và phía sau bằng mắt trần, mở hé cửa để kiểm tra, khi an toàn mới mở cửa đủ để bước ra.",
        isCorrect: true,
      },
      {
        content:
          "Mở toang cửa nhanh chóng để người khác thấy và chủ động tránh.",
        isCorrect: false,
      },
      {
        content: "Đạp mạnh phanh rồi mở cửa bước ra ngay lập tức.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 211,
    content:
      "Khi khởi hành xe ô tô số sàn trên đường bằng, người lái xe phải thực hiện thao tác nào?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["B", "C"],
    answers: [
      {
        content:
          "Đạp hết hành trình ly hợp (côn), vào số 1, nhả phanh tay, nhả từ từ ly hợp kết hợp tăng ga nhẹ để xe chuyển động.",
        isCorrect: true,
      },
      {
        content: "Không cần đạp ly hợp, vào thẳng số 1 rồi đạp mạnh ga.",
        isCorrect: false,
      },
      {
        content:
          "Nhả phanh tay trước, đạp ga mạnh rồi mới nhả ly hợp đột ngột.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 212,
    content:
      "Khi điều khiển xe ô tô có hệ thống phanh chống bó cứng (ABS) phanh gấp, người lái xe cần làm gì?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Đạp mạnh và giữ chặt bàn đạp phanh cho đến khi xe dừng hẳn hoặc kiểm soát được tình huống.",
        isCorrect: true,
      },
      {
        content: "Nhấp nhả liên tục bàn đạp phanh (phanh theo nhịp).",
        isCorrect: false,
      },
      { content: "Kéo mạnh phanh tay và tắt công tắc máy.", isCorrect: false },
    ],
  },
  {
    indexNumber: 213,
    content:
      "Khi điều khiển xe ô tô vượt qua đoạn đường sắt không có rào chắn, người lái xe phải xử lý như thế nào để đảm bảo an toàn?",
    isCritical: true,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Dừng xe cách ray gần nhất tối thiểu 5m, quan sát, nếu không có tàu thì về số thấp, tăng ga nhẹ qua đường sắt, không thay đổi số giữa chừng.",
        isCorrect: true,
      },
      {
        content:
          "Tăng tốc độ thật nhanh để vượt qua đường sắt trước khi tàu đến.",
        isCorrect: false,
      },
      {
        content: "Hạ hết kính cửa sổ, bấm còi liên tục và chạy xe qua.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 214,
    content:
      "Khi điều khiển xe ô tô tự động đi vào đường ngập nước sâu, người lái xe cần xử lý như thế nào?",
    isCritical: true,
    chapterCode: "CH03",
    licenses: ["B1", "B"],
    answers: [
      {
        content:
          "Chuyển sang chế độ số tay (số thấp), giữ đều ga, không tăng giảm ga đột ngột, di chuyển cẩn thận qua đoạn ngập.",
        isCorrect: true,
      },
      {
        content: "Đạp ga thật mạnh để xe vượt qua nhanh, tránh tắt máy.",
        isCorrect: false,
      },
      {
        content: "Để số D, vừa đi vừa rà nhẹ phanh chân liên tục.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 215,
    content:
      "Khi lái xe ô tô vào đường cao tốc, người lái xe phải thực hiện việc nhập làn như thế nào?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Bật đèn tín hiệu, quan sát, di chuyển trên làn đường tăng tốc đến khi đạt tốc độ phù hợp mới nhập vào làn đường cao tốc.",
        isCorrect: true,
      },
      {
        content:
          "Nhập làn ngay lập tức khi vừa qua trạm thu phí mà không cần xi nhan.",
        isCorrect: false,
      },
      {
        content:
          "Chạy xe thật chậm sát lề đường bên trái để chờ các xe khác nhường.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 216,
    content: "Khi chuẩn bị ra khỏi đường cao tốc, người lái xe phải làm gì?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Chuyển dần sang làn đường bên phải; nếu có làn đường giảm tốc thì phải cho xe chạy trên làn đường đó trước khi rời cao tốc.",
        isCorrect: true,
      },
      {
        content: "Phanh gấp ngay tại lối ra để chuyển hướng kịp thời.",
        isCorrect: false,
      },
      { content: "Lùi lại nếu lỡ đi quá lối rẽ quy định.", isCorrect: false },
    ],
  },
  {
    indexNumber: 217,
    content:
      "Để quay đầu xe trong không gian hẹp, người lái xe cần thực hiện nguyên tắc kỹ thuật nào?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Tiến nhiều hơn lùi; đưa đầu xe về phía nguy hiểm, đuôi xe về phía an toàn.",
        isCorrect: false,
      },
      {
        content:
          "Tiến nhiều hơn lùi; đưa đầu xe về phía an toàn, đuôi xe về phía nguy hiểm.",
        isCorrect: true,
      },
      {
        content: "Lùi nhiều hơn tiến để tiết kiệm diện tích.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 218,
    content:
      "Khi điều khiển xe ô tô chạy trong trời mưa to hoặc sương mù dày đặc, người lái xe phải làm gì?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Giảm tốc độ, bật đèn chiếu gần, đèn sương mù và đèn cảnh báo nguy hiểm; giữ khoảng cách an toàn với xe đi trước.",
        isCorrect: true,
      },
      {
        content:
          "Bật đèn pha chiếu xa, tăng tốc bám sát đuôi xe phía trước để nhìn rõ đường.",
        isCorrect: false,
      },
      { content: "Chạy xe bình thường và bấm còi liên tục.", isCorrect: false },
    ],
  },
  {
    indexNumber: 219,
    content:
      "Khi lùi xe ô tô, người lái xe phải quan sát và thao tác như thế nào?",
    isCritical: true,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Phải quan sát phía sau, có tín hiệu cần thiết và chỉ khi thấy không nguy hiểm mới được lùi xe với tốc độ chậm.",
        isCorrect: true,
      },
      {
        content: "Chỉ cần nhìn gương chiếu hậu bên trái và lùi thật nhanh.",
        isCorrect: false,
      },
      {
        content:
          "Lùi xe thoải mái nếu xe có trang bị camera lùi mà không cần nhìn xung quanh.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 220,
    content: "Dây đai an toàn được trang bị trên ô tô có tác dụng gì chủ yếu?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Giữ chặt người lái và hành khách trên ghế ngồi khi xe phanh gấp hoặc xảy ra va chạm.",
        isCorrect: true,
      },
      {
        content: "Giúp người ngồi không bị mỏi lưng khi đi đường dài.",
        isCorrect: false,
      },
      { content: "Để tích hợp hệ thống sưởi ấm ghế.", isCorrect: false },
    ],
  },

  // --- CH04: Cấu tạo và sửa chữa (8 câu) ---
  {
    indexNumber: 268,
    content: "Hệ thống truyền lực của xe ô tô có công dụng gì?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Dùng để truyền mô men quay từ động cơ đến các bánh xe chủ động của ô tô.",
        isCorrect: true,
      },
      {
        content: "Dùng để thay đổi hướng chuyển động của ô tô.",
        isCorrect: false,
      },
      {
        content: "Dùng để giảm tốc độ hoặc dừng hẳn xe ô tô.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 269,
    content: "Ly hợp (côn) trên xe ô tô dùng để làm gì?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B", "C"],
    answers: [
      {
        content:
          "Dùng để truyền hoặc ngắt truyền động từ động cơ đến hộp số trong các trường hợp cần thiết.",
        isCorrect: true,
      },
      {
        content: "Dùng để thay đổi tốc độ của xe ô tô trên đường.",
        isCorrect: false,
      },
      {
        content: "Dùng để tích trữ năng lượng điện cho ắc quy.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 270,
    content: "Hộp số của xe ô tô có công dụng chính là gì?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Truyền và thay đổi mô men, tốc độ; cho phép xe ô tô chuyển động lùi.",
        isCorrect: true,
      },
      {
        content: "Giúp xe bám đường tốt hơn khi đi vào đường trơn trượt.",
        isCorrect: false,
      },
      { content: "Điều khiển hệ thống treo nâng hạ gầm xe.", isCorrect: false },
    ],
  },
  {
    indexNumber: 271,
    content: "Hệ thống lái của xe ô tô có công dụng gì?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Dùng để thay đổi hướng chuyển động hoặc giữ cho ô tô chuyển động ổn định theo hướng xác định.",
        isCorrect: true,
      },
      {
        content: "Dùng để giảm tốc độ của xe khi gặp chướng ngại vật.",
        isCorrect: false,
      },
      {
        content: "Dùng để ngắt động cơ ra khỏi hệ thống truyền lực.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 272,
    content: "Hệ thống phanh của xe ô tô có công dụng gì?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Dùng để giảm tốc độ, dừng hẳn xe ô tô hoặc giữ cho xe ô tô đứng yên trên đường dốc.",
        isCorrect: true,
      },
      {
        content: "Dùng để thay đổi mô men quay của các bánh xe.",
        isCorrect: false,
      },
      { content: "Dùng để khởi động động cơ đốt trong.", isCorrect: false },
    ],
  },
  {
    indexNumber: 273,
    content: "Đèn phanh lắp phía sau xe ô tô có tác dụng gì?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Cảnh báo cho các xe phía sau biết xe đang giảm tốc độ hoặc dừng lại; có tác dụng định vị xe vào ban đêm.",
        isCorrect: true,
      },
      {
        content: "Chiếu sáng phía sau để người lái xe dễ lùi xe vào ban đêm.",
        isCorrect: false,
      },
      { content: "Báo hiệu xe chuẩn bị tăng tốc.", isCorrect: false },
    ],
  },
  {
    indexNumber: 274,
    content:
      "Kính chắn gió trang bị trên ô tô phải đảm bảo yêu cầu nào dưới đây?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Là loại kính an toàn, nhiều lớp, không bị biến dạng hình ảnh, đảm bảo tầm nhìn rõ ràng.",
        isCorrect: true,
      },
      {
        content: "Là loại kính cường lực thông thường, có màu tối để che nắng.",
        isCorrect: false,
      },
      { content: "Là loại kính mica dẻo chống vỡ.", isCorrect: false },
    ],
  },
  {
    indexNumber: 275,
    content: "Nguyên nhân nào dưới đây có thể làm cho động cơ diesel không nổ?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["C"],
    answers: [
      {
        content:
          "Hết nhiên liệu; lõi lọc nhiên liệu bị tắc; có không khí lẫn trong hệ thống nhiên liệu.",
        isCorrect: true,
      },
      {
        content: "Hệ thống đánh lửa bugi bị hỏng hoặc mất tia lửa điện.",
        isCorrect: false,
      },
      { content: "Do xe bị hỏng hệ thống gạt nước.", isCorrect: false },
    ],
  },

  // --- CH05: Báo hiệu đường bộ (6 câu) ---
  {
    indexNumber: 305,
    content:
      "Biển nào cấm các loại xe cơ giới đi vào (trừ xe gắn máy, xe mô tô hai bánh và các loại xe ưu tiên)?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Biển cấm ô tô (Biển hình tròn viền đỏ, có vẽ hình ô tô con).",
        isCorrect: true,
      },
      { content: "Biển cấm xe tải.", isCorrect: false },
      { content: "Biển cấm xe khách.", isCorrect: false },
    ],
  },
  {
    indexNumber: 306,
    content:
      "Khi gặp biển báo 'Đường trơn' (hình tam giác vàng vẽ chiếc xe ô tô bị nghiêng và các vệt bánh xe ngoằn ngoèo), người lái xe cần làm gì?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Giảm tốc độ, tránh phanh gấp, tránh đánh lái đột ngột để đảm bảo an toàn.",
        isCorrect: true,
      },
      {
        content: "Tăng tốc thật nhanh để vượt qua đoạn đường nguy hiểm.",
        isCorrect: false,
      },
      {
        content: "Giữ nguyên tốc độ và bật đèn pha chiếu xa.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 307,
    content:
      "Biển báo hiệu có hình tam giác đều, viền đỏ, nền vàng, trên nền có hình vẽ màu đen là loại biển gì?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Biển báo cấm.", isCorrect: false },
      { content: "Biển báo nguy hiểm.", isCorrect: true },
      { content: "Biển hiệu lệnh.", isCorrect: false },
    ],
  },
  {
    indexNumber: 308,
    content:
      "Ý nghĩa của biển hiệu lệnh hình tròn nền xanh, vẽ mũi tên chỉ hướng đi thẳng là gì?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Bắt buộc các phương tiện chỉ được đi thẳng.",
        isCorrect: true,
      },
      { content: "Cấm tất cả các phương tiện đi thẳng.", isCorrect: false },
      { content: "Chỉ dẫn đường cụt phía trước.", isCorrect: false },
    ],
  },
  {
    indexNumber: 309,
    content: "Vạch kẻ đường màu trắng, nét đứt dùng để phân chia điều gì?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Phân chia các làn xe cùng chiều, các xe được phép đè vạch để chuyển làn.",
        isCorrect: true,
      },
      {
        content: "Phân chia hai chiều xe chạy ngược chiều nhau.",
        isCorrect: false,
      },
      { content: "Cấm các xe đè vạch hoặc chuyển làn.", isCorrect: false },
    ],
  },
  {
    indexNumber: 310,
    content: "Biển nào báo hiệu 'Hết mọi lệnh cấm'?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Biển tròn nền trắng, có 5 vạch đen chéo đè lên vòng tròn xanh xám.",
        isCorrect: true,
      },
      { content: "Biển báo hết cấm vượt.", isCorrect: false },
      { content: "Biển báo hết giới hạn tốc độ tối đa.", isCorrect: false },
    ],
  },

  // --- CH06: Giải thế sa hình và xử lý tình huống (4 câu) ---
  {
    indexNumber: 490,
    content:
      "Tại ngã tư không có hệ thống biển báo và đèn tín hiệu, xe quân sự đi thẳng và xe cứu thương đi thẳng thì xe nào được quyền ưu tiên đi trước?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Xe quân sự (Theo thứ tự ưu tiên: Hỏa - Sự - Công - Thương).",
        isCorrect: true,
      },
      { content: "Xe cứu thương.", isCorrect: false },
      { content: "Hai xe đi cùng một lúc.", isCorrect: false },
    ],
  },
  {
    indexNumber: 491,
    content:
      "Khi một xe ô tô con đã tiến vào bên trong ngã tư (vượt quá vạch dừng) trước khi đèn tín hiệu chuyển sang màu đỏ, các xe khác phải nhường đường như thế nào?",
    isCritical: true,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Xe con được quyền tiếp tục đi và thoát khỏi ngã tư; các xe hướng khác phải nhường đường.",
        isCorrect: true,
      },
      {
        content:
          "Xe con phải dừng lại ngay giữa ngã tư để chờ tín hiệu tiếp theo.",
        isCorrect: false,
      },
      {
        content: "Các xe hướng khác được đi thẳng và ép xe con lùi lại.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 492,
    content:
      "Tại ngã tư, xe khách đang rẽ trái, xe tải đang đi thẳng từ hướng đối diện. Xe nào phải nhường đường theo quy tắc?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["B1", "B", "C"],
    answers: [
      {
        content:
          "Xe khách phải nhường đường (Vì xe rẽ trái phải nhường đường cho xe đi thẳng).",
        isCorrect: true,
      },
      { content: "Xe tải phải nhường đường.", isCorrect: false },
      { content: "Xe nào to hơn thì được đi trước.", isCorrect: false },
    ],
  },
  {
    indexNumber: 493,
    content:
      "Trong tình huống sa hình có xe đi đè lên vạch kẻ đường liền màu vàng chia hai chiều xe chạy, hành vi đó được xác định như thế nào?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Vi phạm quy tắc giao thông.", isCorrect: true },
      { content: "Đúng quy tắc giao thông.", isCorrect: false },
      { content: "Được phép nếu đường vắng.", isCorrect: false },
    ],
  },

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
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
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
      { content: "On bridge with 2 or more lanes.", isCorrect: false },
      {
        content:
          "Xe được quyền ưu tiên đang phát tín hiệu ưu tiên đi làm nhiệm vụ.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 4,
    content:
      "Ở phần đường dành cho người đi bộ qua đường, trên cầu, đầu cầu, đường cao tốc, đường hẹp, đường dốc, tại nơi đường bộ giao nhau cùng mức với đường sắt có được quay đầu xe hay không?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Được phép.", isCorrect: false },
      { content: "Không được phép.", isCorrect: true },
      { content: "Tùy từng trường hợp.", isCorrect: false },
    ],
  },
  {
    indexNumber: 5,
    content:
      "Người điều khiển xe mô tô hai bánh, ba bánh, xe gắn máy có được phép sử dụng xe để kéo hoặc đẩy các phương tiện khác khi tham gia giao thông không?",
    isCritical: true,
    chapterCode: "CH01",
    licenses: ["A1", "A"],
    answers: [
      { content: "Được phép.", isCorrect: false },
      {
        content: "Nếu phương tiện được kéo có khối lượng nhỏ hơn xe mình.",
        isCorrect: false,
      },
      { content: "Không được phép.", isCorrect: true },
    ],
  },

  // =========================================================================
  // --- CH02: VĂN HÓA GIAO THÔNG VÀ ĐẠO ĐỨC NGƯỜI LÁI XE (5 câu độc nhất) ---
  // =========================================================================
  {
    indexNumber: 181,
    content:
      "Người lái xe cố tình vi phạm Luật giao thông đường bộ, gây tai nạn giao thông rồi bỏ chạy để trốn tránh trách nhiệm hoặc cố ý không cứu giúp người bị tai nạn giao thông thì bị xử lý như thế nào?",
    isCritical: true,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Không bị xử lý hình sự.", isCorrect: false },
      { content: "Bị xử lý theo quy định của pháp luật.", isCorrect: true },
      { content: "Chỉ bị xử phạt hành chính.", isCorrect: false },
    ],
  },
  {
    indexNumber: 182,
    content:
      "Trong các hành vi dưới đây, người lái xe có văn hóa giao thông phải ứng xử như thế nào?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["A1", "B1", "B", "C", "D"],
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
    ],
  },
  {
    indexNumber: 183,
    content:
      "Khi xảy ra tai nạn giao thông, người lái xe và người có mặt tại hiện trường vụ tai nạn phải thực hiện các công việc gì dưới đây?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Đặt biển cảnh báo hoặc vật báo hiệu ở phía trước và phía sau hiện trường xảy ra tai nạn để cảnh báo; kiểm tra tình trạng thương tích của người bị nạn và sơ cứu giúp người bị nạn; báo tin ngay cho cơ quan chức năng.",
        isCorrect: true,
      },
      {
        content:
          "Nhanh chóng lái xe gây tai nạn hoặc nhờ xe khác ra khỏi hiện trường vụ tai nạn.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 184,
    content:
      "Khi sơ cứu người bị tai nạn giao thông đường bộ có vết thương chảy máu ngoài màu đỏ thẫm, trào ra sát mép vết thương và chảy chậm, người sơ cứu cần làm gì?",
    isCritical: false,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      { content: "Thực hiện cầm máu trực tiếp.", isCorrect: true },
      {
        content: "Thực hiện cầm máu bằng gạc (ép động mạch).",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 185,
    content:
      "Hành vi gây gổ, ẩu đả hoặc đe dọa người khác sau khi xảy ra va chạm giao thông có vi phạm đạo đức người lái xe không?",
    isCritical: true,
    chapterCode: "CH02",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Vi phạm nghiêm trọng đạo đức và văn hóa giao thông.",
        isCorrect: true,
      },
      {
        content: "Không vi phạm vì đó là phản ứng tâm lý bình thường.",
        isCorrect: false,
      },
    ],
  },

  // =========================================================================
  // --- CH03: KỸ THUẬT LÁI XE (5 câu độc nhất) ---
  // =========================================================================
  {
    indexNumber: 210,
    content:
      "Khi điều khiển xe mô tô tay ga xuống đường dốc dài, độ dốc cao, người lái xe cần thực hiện các thao tác nào dưới đây để đảm bảo an toàn?",
    isCritical: true,
    chapterCode: "CH03",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Giữ tay ga ở mức độ phù hợp, sử dụng đồng thời cả phanh trước và phanh sau để giảm tốc độ.",
        isCorrect: true,
      },
      {
        content: "Nhả hết tay ga, tắt động cơ xe và rà phanh liên tục.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 211,
    content:
      "Khi quay đầu xe mô tô trong không gian hẹp, người lái xe cần thực hiện thao tác nào để đảm bảo an toàn giao thông?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Quan sát kỹ địa hình, điều khiển xe với tốc độ thấp, giữ thăng bằng ổn định và báo tín hiệu chuyển hướng.",
        isCorrect: true,
      },
      {
        content:
          "Tăng ga thật mạnh để xe quay đầu nhanh hơn, tránh cản trở xe khác.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 212,
    content:
      "Khi điều khiển xe mô tô chạy trên đường dốc, gặp chướng ngại vật khuất tầm nhìn, người lái xe cần làm gì?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Đi đúng làn đường, giảm tốc độ quy định, không được vượt xe khác.",
        isCorrect: true,
      },
      {
        content: "Lấn sang làn đường ngược chiều để mở rộng góc quan sát.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 213,
    content:
      "Khi tránh nhau trên đường hẹp vào ban đêm, người điều khiển xe mô tô phải xử lý như thế nào?",
    isCritical: false,
    chapterCode: "CH03",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Chuyển từ đèn chiếu xa sang đèn chiếu gần, đi chậm sát về phía bên phải để nhường đường.",
        isCorrect: true,
      },
      {
        content:
          "Bật đèn pha thật sáng để nhìn rõ chướng ngại vật của xe đối diện.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 214,
    content:
      "Khi lùi xe mô tô ba bánh hoặc đi vào ngõ hẹp, người lái xe phải lưu ý điều gì?",
    isCritical: true,
    chapterCode: "CH03",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Phải quan sát kỹ phía sau, phát tín hiệu cần thiết và chỉ lùi khi đảm bảo không có nguy hiểm.",
        isCorrect: true,
      },
      {
        content: "Lùi thật nhanh để không làm ùn tắc giao thông.",
        isCorrect: false,
      },
    ],
  },

  // =========================================================================
  // --- CH04: CẤU TẠO VÀ SỬA CHỮA (5 câu độc nhất) ---
  // =========================================================================
  {
    indexNumber: 264,
    content:
      "Yêu cầu kỹ thuật đối với hệ thống xích hoặc dây đai truyền động của xe mô tô hai bánh phải như thế nào?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      {
        content:
          "Lắp đặt chắc chắn, độ căng của xích hoặc dây đai nằm trong giới hạn tiêu chuẩn kỹ thuật.",
        isCorrect: true,
      },
      {
        content: "Càng căng càng tốt để xe tăng tốc nhanh hơn.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 265,
    content:
      "Âm lượng của còi điện lắp trên xe tham gia giao thông đường bộ yêu cầu an toàn kỹ thuật như thế nào?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Không nhỏ hơn 90 dB (A), không lớn hơn 115 dB (A).",
        isCorrect: true,
      },
      {
        content: "Không nhỏ hơn 70 dB (A), không lớn hơn 90 dB (A).",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 266,
    content:
      "Tác dụng chủ yếu của hệ thống phanh (thắng) trên xe mô tô hai bánh là gì?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Dùng để giảm tốc độ, dừng hẳn xe hoặc giữ cố định xe khi dừng đỗ.",
        isCorrect: true,
      },
      {
        content: "Dùng để thay đổi mô men xoắn và hướng chuyển động.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 267,
    content:
      "Khi kiểm tra áp suất lốp (vỏ xe) của xe mô tô hai bánh, người lái xe nên tuân theo quy tắc nào?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Kiểm tra định kỳ khi lốp nguội, áp suất khí nén phải đúng theo tiêu chuẩn quy định của nhà sản xuất.",
        isCorrect: true,
      },
      {
        content: "Bơm lốp thật căng để giảm diện tích tiếp xúc với mặt đường.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 268,
    content:
      "Đèn phanh (đèn báo tín hiệu dừng) phía sau xe mô tô có tác dụng gì?",
    isCritical: false,
    chapterCode: "CH04",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Cảnh báo cho các phương tiện phía sau biết xe đang giảm tốc độ để chủ động phòng tránh.",
        isCorrect: true,
      },
      {
        content: "Dùng để rọi đường phía sau khi đi ban đêm.",
        isCorrect: false,
      },
    ],
  },

  // =========================================================================
  // --- CH05: BÁO HIỆU ĐƯỜNG BỘ (5 câu độc nhất) ---
  // =========================================================================
  {
    indexNumber: 301,
    content:
      "Biển báo hiệu có dạng hình tròn, viền đỏ, nền trắng, trên nền có hình vẽ hoặc chữ số màu đen là loại biển gì dưới đây?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B", "C", "D"],
    answers: [
      { content: "Biển báo nguy hiểm.", isCorrect: false },
      { content: "Biển báo cấm.", isCorrect: true },
      { content: "Biển báo chỉ dẫn.", isCorrect: false },
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
    ],
  },
  {
    indexNumber: 303,
    content:
      "Biển báo hiệu có dạng hình chữ nhật hoặc hình vuông, nền màu xanh là loại biển gì?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      { content: "Biển báo lệnh.", isCorrect: false },
      { content: "Biển báo chỉ dẫn.", isCorrect: true },
    ],
  },
  {
    indexNumber: 304,
    content: "Vạch kẻ đường màu vàng, nét đứt dùng để phân chia điều gì?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Phạch phân chia hai chiều xe chạy ngược chiều nhau (tim đường).",
        isCorrect: true,
      },
      {
        content: "Vạch phân chia các làn xe chạy cùng chiều.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 305,
    content: "Biển nào dưới đây báo hiệu 'Hết mọi lệnh cấm'?",
    isCritical: false,
    chapterCode: "CH05",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Biển hình tròn nền trắng có các vạch đen chéo đè lên.",
        isCorrect: true,
      },
      { content: "Biển báo hết giới hạn tốc độ tối đa.", isCorrect: false },
    ],
  },

  // =========================================================================
  // --- CH06: GIẢI THẾ SA HÌNH VÀ XỬ LÝ TÌNH HUỐNG (5 câu độc nhất) ---
  // =========================================================================
  {
    indexNumber: 486,
    content:
      "Thứ tự các xe ưu tiên đi như thế nào là đúng quy tắc giao thông đường bộ Việt Nam?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      { content: "Xe con, xe tải, xe khách.", isCorrect: false },
      {
        content: "Xe chữa cháy -> Xe quân sự, xe công an -> Xe cứu thương.",
        isCorrect: true,
      },
    ],
  },
  {
    indexNumber: 487,
    content:
      "Xe nào được quyền ưu tiên đi trước tại nơi đường giao nhau cùng cấp không có biển báo?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      {
        content: "Xe rẽ phải và xe đi thẳng hướng bên phải không vướng.",
        isCorrect: true,
      },
      { content: "Xe rẽ trái được quyền đi trước.", isCorrect: false },
    ],
  },
  {
    indexNumber: 488,
    content:
      "Khi muốn vượt xe tải đi phía trước, người lái xe mô tô phải xử lý như thế nào là đúng luật?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B", "C"],
    answers: [
      {
        content:
          "Bật tín hiệu báo hiệu bằng đèn hoặc còi; khi đủ điều kiện an toàn mới được vượt.",
        isCorrect: true,
      },
      {
        content: "Tăng ga, nhanh chóng vượt qua phía bên phải.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 489,
    content:
      "Bạn xử lý như thế nào khi xe phía trước đang lùi ra khỏi điểm đỗ?",
    isCritical: false,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content:
          "Chờ xe phía trước lùi xong hoặc giảm tốc độ quan sát an toàn mới đi tiếp.",
        isCorrect: true,
      },
      {
        content: "Bấm còi liên tục và tăng tốc để lách qua.",
        isCorrect: false,
      },
    ],
  },
  {
    indexNumber: 490,
    content:
      "Tại ngã tư sa hình, một xe ô tô con đã tiến vào giao lộ vượt quá vạch dừng trước khi đèn đỏ bật sáng, xe đó phải làm gì?",
    isCritical: true,
    chapterCode: "CH06",
    licenses: ["A1", "A", "B1", "B", "C"],
    answers: [
      {
        content: "Được quyền tiếp tục di chuyển để thoát khỏi ngã tư.",
        isCorrect: true,
      },
      { content: "Dừng lại ngay lập tức giữa ngã tư.", isCorrect: false },
    ],
  },
];
