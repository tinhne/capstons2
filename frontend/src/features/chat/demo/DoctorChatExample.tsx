    import React from "react";

/**
 * This is an example demonstration of a doctor chat flow.
 * It shows the sequence of messages when connecting with a doctor
 * after the system couldn't find symptoms in the database.
 */
const DoctorChatExample: React.FC = () => {
  // This is just a sample script of how the conversation would flow
  const chatExample = [
    {
      sender: "user",
      content: "Tôi bị đau họng và sưng hạch dưới cằm",
      time: "10:15",
    },
    {
      sender: "bot",
      content: "Không tìm thấy triệu chứng phù hợp trong cơ sở dữ liệu",
      time: "10:15",
    },
    {
      sender: "system",
      content: 'Hiện thị nút "Kết nối với bác sĩ"',
      time: "10:15",
    },
    {
      sender: "user",
      content: "[Nhấn nút Kết nối với bác sĩ]",
      time: "10:16",
    },
    {
      sender: "bot",
      content: "Đang kết nối bạn với bác sĩ...",
      time: "10:16",
    },
    {
      sender: "doctor",
      content:
        "Xin chào, tôi là Bác sĩ Minh. Tôi hiểu rằng bạn đang có triệu chứng đau họng và sưng hạch dưới cằm. Bạn có thể cho tôi biết các triệu chứng này đã kéo dài bao lâu rồi?",
      time: "10:17",
    },
    {
      sender: "user",
      content:
        "Triệu chứng đã có khoảng 3 ngày rồi bác sĩ ạ. Ban đầu chỉ đau họng nhẹ, nhưng giờ đã nghiêm trọng hơn và tôi cảm thấy hạch dưới cằm bị sưng.",
      time: "10:18",
    },
    {
      sender: "doctor",
      content:
        "Cảm ơn bạn đã chia sẻ. Bạn có bị sốt không? Và có khó nuốt hoặc khó thở không?",
      time: "10:19",
    },
    {
      sender: "user",
      content:
        "Tôi có sốt nhẹ khoảng 37.5°C và cảm thấy hơi khó nuốt, nhưng không khó thở.",
      time: "10:20",
    },
    {
      sender: "doctor",
      content:
        "Dựa trên các triệu chứng bạn mô tả, có thể bạn đang bị viêm amidan hoặc viêm họng do vi khuẩn. Sưng hạch dưới cằm là phản ứng của hệ thống miễn dịch đối với nhiễm trùng. Tôi khuyên bạn nên:",
      time: "10:21",
    },
    {
      sender: "doctor",
      content:
        "1. Uống nhiều nước và nghỉ ngơi\n2. Súc họng với nước muối ấm\n3. Dùng thuốc giảm đau không kê đơn như paracetamol\n4. Đến gặp bác sĩ để kiểm tra trực tiếp, vì có thể bạn cần dùng kháng sinh nếu là viêm họng do vi khuẩn.",
      time: "10:22",
    },
    {
      sender: "user",
      content:
        "Cảm ơn bác sĩ. Tôi sẽ làm theo lời khuyên của bác sĩ. Liệu tôi có thể uống kháng sinh ngay không hay cần phải có kết quả xét nghiệm?",
      time: "10:23",
    },
    {
      sender: "doctor",
      content:
        "Bạn không nên tự ý sử dụng kháng sinh mà không có chỉ định của bác sĩ. Cần phải khám lâm sàng để xác định nguyên nhân, và trong một số trường hợp còn cần xét nghiệm trước khi dùng kháng sinh. Lạm dụng kháng sinh có thể gây kháng thuốc và tác dụng phụ không mong muốn.",
      time: "10:24",
    },
    {
      sender: "user",
      content:
        "Vâng, tôi hiểu rồi. Tôi sẽ đến phòng khám để được thăm khám trực tiếp. Cảm ơn bác sĩ nhiều!",
      time: "10:25",
    },
    {
      sender: "doctor",
      content:
        "Không có gì. Chúc bạn sớm khỏe mạnh! Nếu các triệu chứng trở nên nghiêm trọng hơn như khó thở, sốt cao hoặc đau họng dữ dội, hãy đến cơ sở y tế ngay lập tức. Bạn có thể liên hệ lại với tôi nếu có bất kỳ câu hỏi nào khác.",
      time: "10:26",
    },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Ví dụ kết nối chat với bác sĩ
      </h1>

      <div className="border rounded-lg bg-gray-50 p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Tình huống:</h2>
        <p>
          Người dùng tìm kiếm triệu chứng "đau họng và sưng hạch dưới cằm" nhưng
          hệ thống không tìm thấy trong cơ sở dữ liệu (trả về mã lỗi 2002). Hệ
          thống đề xuất kết nối với bác sĩ và người dùng đồng ý.
        </p>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="bg-blue-900 text-white p-3">
          <h3 className="font-semibold">Cuộc trò chuyện</h3>
        </div>

        <div className="bg-gray-100 p-4 h-[500px] overflow-y-auto flex flex-col space-y-4">
          {chatExample.map((message, index) => {
            if (message.sender === "system") {
              return (
                <div
                  key={index}
                  className="text-center text-gray-500 text-sm italic"
                >
                  {message.content}
                </div>
              );
            }

            return (
              <div
                key={index}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white"
                      : message.sender === "doctor"
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold">
                      {message.sender === "user"
                        ? "Bạn"
                        : message.sender === "doctor"
                        ? "Bác sĩ Minh"
                        : "Bot"}
                    </span>
                    <span className="text-xs opacity-70">{message.time}</span>
                  </div>
                  <p style={{ whiteSpace: "pre-line" }}>{message.content}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-white p-3 border-t">
          <div className="flex">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled
            />
            <button className="bg-blue-500 text-white px-4 rounded-r-lg disabled:bg-blue-300">
              Gửi
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 text-gray-600 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">Lưu ý về triển khai:</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Trong môi trường thực tế, kết nối với bác sĩ có thể yêu cầu người
            dùng đăng nhập hoặc cung cấp thông tin liên lạc.
          </li>
          <li>
            Các câu trả lời của bác sĩ trong ví dụ này được tạo sẵn. Trong ứng
            dụng thực tế, sẽ có bác sĩ thật trả lời hoặc sử dụng AI được đào tạo
            chuyên sâu.
          </li>
          <li>
            Cần bổ sung thêm cơ chế thông báo và quản lý trạng thái kết nối để
            người dùng biết khi nào bác sĩ sẵn sàng trả lời.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DoctorChatExample;
