import random
from faker import Faker
import pandas as pd
from datetime import datetime, timedelta
import unicodedata
import re

fake = Faker('vi_VN')

def remove_vietnamese_diacritics(text):
    """Loại bỏ dấu tiếng Việt và chuyển 'đ' thành 'd'."""
    if not isinstance(text, str):
        return ''
    tv_chars = {
        'á': 'a', 'à': 'a', 'ả': 'a', 'ã': 'a', 'ạ': 'a', 'ă': 'a', 'ắ': 'a', 'ằ': 'a', 'ẳ': 'a', 'ẵ': 'a', 'ặ': 'a',
        'â': 'a', 'ấ': 'a', 'ầ': 'a', 'ẩ': 'a', 'ẫ': 'a', 'ậ': 'a', 'đ': 'd', 'é': 'e', 'è': 'e', 'ẻ': 'e', 'ẽ': 'e',
        'ẹ': 'e', 'ê': 'e', 'ế': 'e', 'ề': 'e', 'ể': 'e', 'ễ': 'e', 'ệ': 'e', 'í': 'i', 'ì': 'i', 'ỉ': 'i', 'ĩ': 'i',
        'ị': 'i', 'ó': 'o', 'ò': 'o', 'ỏ': 'o', 'õ': 'o', 'ọ': 'o', 'ô': 'o', 'ố': 'o', 'ồ': 'o', 'ổ': 'o', 'ỗ': 'o',
        'ộ': 'o', 'ơ': 'o', 'ớ': 'o', 'ờ': 'o', 'ở': 'o', 'ỡ': 'o', 'ợ': 'o', 'ú': 'u', 'ù': 'u', 'ủ': 'u', 'ũ': 'u',
        'ụ': 'u', 'ư': 'u', 'ứ': 'u', 'ừ': 'u', 'ử': 'u', 'ữ': 'u', 'ự': 'u', 'ý': 'y', 'ỳ': 'y', 'ỷ': 'y', 'ỹ': 'y',
        'ỵ': 'y',
        'Á': 'A', 'À': 'A', 'Ả': 'A', 'Ã': 'A', 'Ạ': 'A', 'Ă': 'A', 'Ắ': 'A', 'Ằ': 'A', 'Ẳ': 'A', 'Ẵ': 'A', 'Ặ': 'A',
        'Â': 'A', 'Ấ': 'A', 'Ầ': 'A', 'Ẩ': 'A', 'Ẫ': 'A', 'Ậ': 'A', 'Đ': 'D', 'É': 'E', 'È': 'E', 'Ẻ': 'E', 'Ẽ': 'E',
        'Ẹ': 'E', 'Ê': 'E', 'Ế': 'E', 'Ề': 'E', 'Ể': 'E', 'Ễ': 'E', 'Ệ': 'E', 'Í': 'I', 'Ì': 'I', 'Ỉ': 'I', 'Ĩ': 'I',
        'Ị': 'I', 'Ó': 'O', 'Ò': 'O', 'Ỏ': 'O', 'Ô': 'O', 'Ố': 'O', 'Ồ': 'O', 'Ổ': 'O', 'Ỗ': 'O', 'Ộ': 'O', 'Ơ': 'O',
        'Ớ': 'O', 'Ờ': 'O', 'Ở': 'O', 'Ỡ': 'O', 'Ợ': 'O', 'Ú': 'U', 'Ù': 'U', 'Ủ': 'U', 'Ũ': 'U', 'Ụ': 'U', 'Ư': 'U',
        'Ứ': 'U', 'Ừ': 'U', 'Ử': 'U', 'Ữ': 'U', 'Ự': 'U', 'Ý': 'Y', 'Ỳ': 'Y', 'Ỷ': 'Y', 'Ỹ': 'Y', 'Ỵ': 'Y',
    }
    for char, replacement in tv_chars.items():
        text = text.replace(char, replacement)
    return text

def normalize_benh_name(benh_name):
    """Chuẩn hóa tên bệnh thành key phù hợp với schema."""
    if not isinstance(benh_name, str):
        return ''
    # 1. Loại bỏ dấu tiếng Việt và chuyển 'đ' -> 'd'
    no_diacritics = remove_vietnamese_diacritics(benh_name)
    # 2. Thay thế khoảng trắng bằng dấu gạch dưới, loại bỏ các ký tự không phải chữ, số, gạch dưới, chuyển thành chữ thường
    normalized_name = re.sub(r'\s+', '_', no_diacritics).lower()
    normalized_name = re.sub(r'[^a-z0-9_]', '', normalized_name)
    return normalized_name


def get_season(date):
    """Xác định mùa từ ngày."""
    month = date.month
    # Phân chia mùa tương đối theo khí hậu Việt Nam (có thể điều chỉnh)
    if 1 <= month <= 3:
        return 'Đông-Xuân'
    elif 4 <= month <= 6:
        return 'Xuân-Hè'
    elif 7 <= month <= 9:
        return 'Hè-Thu'
    else: # 10 <= month <= 12
        return 'Thu-Đông'

# --- Define the schema with detailed information and ALL keys normalized correctly ---
schema = {
    'gioi_tinh': ['Nam', 'Nữ'],
    'do_tuoi': {'min': 1, 'max': 90},
    'vung_mien': {
        'mien_bac': ['Hà Nội', 'Hải Phòng', 'Quảng Ninh', 'Hà Giang', 'Điện Biên', 'Lào Cai', 'Sơn La', 'Yên Bái', 'Bắc Giang', 'Phú Thọ', 'Vĩnh Phúc', 'Hòa Bình'],
        'mien_trung': ['Đà Nẵng', 'Huế', 'Nha Trang', 'Quảng Bình', 'Quảng Trị', 'Đà Lạt', 'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa', 'Ninh Thuận', 'Bình Thuận'],
        'mien_nam': ['TP.HCM', 'Cần Thơ', 'Vũng Tàu', 'Đồng Nai', 'Bình Dương', 'Cà Mau', 'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Sóc Trăng', 'Bạc Liêu', 'Kiên Giang', 'An Giang', 'Hậu Giang']
    },
     'benh': {
        'ho_hap': [normalize_benh_name(b) for b in ['Cúm', 'Viêm phổi', 'COPD', 'Hen suyễn', 'Viêm phế quản', 'Viêm họng', 'Viêm xoang', 'Lao phổi']],
        'tieu_hoa': [normalize_benh_name(b) for b in ['Tiêu chảy', 'Ngộ độc thực phẩm', 'Viêm loét dạ dày', 'Hội chứng ruột kích thích', 'Viêm gan A', 'Viêm gan B', 'Viêm gan C']],
        'tim_mach': [normalize_benh_name(b) for b in ['Tăng huyết áp', 'Bệnh mạch vành', 'Đột quỵ', 'Suy tim']],
        'truyen_nhiem': [normalize_benh_name(b) for b in ['Sốt xuất huyết', 'Tay chân miệng', 'Sởi', 'Rubella', 'Thủy đậu', 'Sốt rét', 'Sốt mò']],
        'noi_tiet': [normalize_benh_name(b) for b in ['Tiểu đường Type 2', 'Suy giáp', 'Cường giáp']],
        'than_tiet_nieu': [normalize_benh_name(b) for b in ['Viêm đường tiết niệu', 'Sỏi thận']],
        'than_kinh': [normalize_benh_name(b) for b in ['Đau nửa đầu (Migraine)', 'Parkinson', 'Alzheimer']],
        'xuong_khop': [normalize_benh_name(b) for b in ['Thoái hóa khớp', 'Loãng xương', 'Gout']],
        'ung_thu': [normalize_benh_name(b) for b in ['Ung thư vú', 'Ung thư tuyến tiền liệt', 'Ung thư phổi', 'Ung thư gan']],
        'da_lieu': [normalize_benh_name(b) for b in ['Viêm da cơ địa (Eczema)', 'Nấm da']]
    },
    'trieu_chung': {
        normalize_benh_name('Cúm'): ['Sốt', 'Ho', 'Đau họng', 'Mệt mỏi', 'Đau nhức cơ thể', 'Sổ mũi', 'Nghẹt mũi', 'Hắt hơi', 'Đau đầu', 'Ớn lạnh'],
        normalize_benh_name('Viêm phổi'): ['Ho', 'Khó thở', 'Đau ngực', 'Sốt cao', 'Ớn lạnh', 'Khạc đờm (có thể có máu)', 'Thở khò khè', 'Thở nhanh', 'Tím tái môi/đầu ngón tay', 'Mệt mỏi', 'Chán ăn'],
        normalize_benh_name('COPD'): ['Khó thở (đặc biệt khi gắng sức)', 'Ho mãn tính (kéo dài, thường vào buổi sáng)', 'Khạc đờm nhiều (màu trắng, vàng hoặc xanh)', 'Thở rít', 'Tức ngực', 'Mệt mỏi', 'Giảm cân không rõ nguyên nhân', 'Thở nông', 'Phù chân, mắt cá chân', 'Da xanh tái (cyanosis)'],
        normalize_benh_name('Hen suyễn'): ['Khó thở (cơn khó thở đột ngột)', 'Thở khò khè', 'Ho (thường khô, tăng nặng về đêm)', 'Tức ngực', 'Khó thở về đêm hoặc sáng sớm', 'Ho khi gắng sức', 'Thở nhanh', 'Mệt mỏi', 'Khó nói do hụt hơi'],
        normalize_benh_name('Viêm phế quản'): ['Ho (thường có đờm)', 'Khạc đờm (màu trong, trắng, vàng hoặc xanh)', 'Khó thở nhẹ', 'Thở khò khè', 'Sốt nhẹ', 'Đau ngực (khi ho)', 'Mệt mỏi', 'Đau họng', 'Khàn tiếng', 'Hụt hơi'],
        normalize_benh_name('Viêm họng'): ['Đau họng', 'Khó nuốt', 'Sưng hạch cổ', 'Sốt (nhẹ đến vừa)', 'Khàn tiếng', 'Ho (thường khô)', 'Đau đầu', 'Mệt mỏi', 'Ngứa họng', 'Amidan sưng đỏ, có thể có mủ trắng'],
        normalize_benh_name('Viêm xoang'): ['Đau nhức mặt (vùng trán, má, quanh mắt)', 'Nghẹt mũi', 'Chảy nước mũi (đặc, màu vàng/xanh)', 'Ho (thường tăng về đêm)', 'Sốt nhẹ', 'Đau đầu', 'Mệt mỏi', 'Giảm khứu giác', 'Đau răng hàm trên', 'Hôi miệng', 'Chảy nước mũi xuống họng'],
        normalize_benh_name('Lao phổi'): ['Ho kéo dài (trên 2-3 tuần)', 'Khạc đờm (có thể lẫn máu)', 'Sốt nhẹ về chiều', 'Đổ mồ hôi đêm', 'Sụt cân không rõ nguyên nhân', 'Ho ra máu', 'Mệt mỏi', 'Đau ngực (khi hít sâu hoặc ho)', 'Khó thở', 'Khàn tiếng'],
        normalize_benh_name('Tiêu chảy'): ['Tiêu chảy nhiều lần trong ngày (phân lỏng hoặc nước)', 'Đau bụng (quặn thắt)', 'Buồn nôn', 'Nôn', 'Mất nước (khô miệng, khát nước, tiểu ít)', 'Đi ngoài ra máu (nếu do nhiễm khuẩn nặng)', 'Sốt', 'Chóng mặt', 'Mệt mỏi'],
        normalize_benh_name('Ngộ độc thực phẩm'): ['Buồn nôn', 'Nôn (thường đột ngột và dữ dội)', 'Tiêu chảy (đột ngột)', 'Đau bụng (quặn thắt)', 'Sốt (có thể có hoặc không)', 'Chóng mặt', 'Mệt mỏi', 'Đau đầu', 'Co thắt bụng', 'Đi ngoài ra máu'],
        normalize_benh_name('Viêm loét dạ dày'): ['Đau bụng vùng thượng vị (đau âm ỉ hoặc nóng rát, thường liên quan đến bữa ăn)', 'Ợ chua', 'Ợ nóng', 'Buồn nôn', 'Đầy bụng, khó tiêu', 'Chán ăn', 'Sụt cân không rõ nguyên nhân', 'Ợ hơi', 'Đau bụng sau khi ăn (đối với loét dạ dày)', 'Đau bụng khi đói (đối với loét tá tràng)', 'Đi ngoài phân đen (xuất huyết tiêu hóa)'],
        normalize_benh_name('Hội chứng ruột kích thích'): ['Đau bụng (thường giảm sau khi đi tiêu)', 'Đầy hơi', 'Táo bón (hoặc tiêu chảy, hoặc cả hai luân phiên)', 'Tiêu chảy', 'Thay đổi thói quen đi tiêu', 'Phân có chất nhầy', 'Ợ hơi', 'Buồn nôn', 'Mệt mỏi', 'Đau đầu', 'Lo lắng', 'Trầm cảm'],
        normalize_benh_name('Viêm gan A'): ['Vàng da (mắt và da vàng)', 'Mệt mỏi', 'Chán ăn', 'Buồn nôn', 'Đau bụng (vùng gan)', 'Nước tiểu sẫm màu', 'Sốt nhẹ', 'Ngứa da', 'Tiêu chảy', 'Đau khớp', 'Gan to, ấn đau'],
        normalize_benh_name('Viêm gan B'): ['Vàng da (có thể có hoặc không)', 'Mệt mỏi kéo dài', 'Chán ăn', 'Đau bụng (vùng gan)', 'Nước tiểu sẫm màu', 'Đau khớp', 'Ngứa da', 'Phù chân, mắt cá chân (giai đoạn muộn)', 'Cổ trướng (bụng báng - giai đoạn muộn)', 'Xuất huyết dưới da (giai đoạn muộn)', 'Gan to'],
        normalize_benh_name('Viêm gan C'): ['Thường không có triệu chứng trong nhiều năm (giai đoạn đầu)', 'Mệt mỏi', 'Chán ăn', 'Đau khớp', 'Nước tiểu sẫm màu', 'Vàng da (thường ở giai đoạn xơ gan)', 'Ngứa da', 'Đau bụng (vùng gan)', 'Sụt cân không rõ nguyên nhân', 'Phù chân', 'Cổ trướng', 'Xuất huyết dưới da'],
        normalize_benh_name('Tăng huyết áp'): ['Đau đầu (thường ở đỉnh đầu hoặc sau gáy)', 'Chóng mặt', 'Mờ mắt', 'Khó thở (khi gắng sức)', 'Đau ngực (nếu nặng)', 'Thường không có triệu chứng rõ ràng ở giai đoạn đầu', 'Ù tai', 'Đỏ mặt', 'Đau sau gáy', 'Chảy máu mũi'],
        normalize_benh_name('Bệnh mạch vành'): ['Đau thắt ngực (cơn đau bóp nghẹt ở ngực, lan lên vai, tay trái, hàm)', 'Khó thở', 'Mệt mỏi', 'Vã mồ hôi', 'Chóng mặt', 'Ngất xỉu', 'Đau cánh tay trái', 'Đau hàm', 'Đau vai', 'Buồn nôn', 'Khó tiêu'],
        normalize_benh_name('Đột quỵ'): ['Yếu liệt đột ngột một bên cơ thể (tay, chân, mặt)', 'Nói khó, nói ngọng hoặc không nói được', 'Méo miệng', 'Mất thị lực đột ngột (một hoặc cả hai mắt)', 'Đau đầu dữ dội đột ngột', 'Mất ý thức', 'Khó nuốt', 'Chóng mặt đột ngột', 'Mất thăng bằng hoặc phối hợp vận động', 'Co giật'],
        normalize_benh_name('Suy tim'): ['Khó thở (tăng khi gắng sức, khi nằm)', 'Phù (chân, mắt cá chân, bụng)', 'Mệt mỏi, yếu sức', 'Ho (khan hoặc có đờm màu hồng)', 'Khó thở khi nằm (phải kê cao gối)', 'Tăng cân nhanh chóng (do giữ nước)', 'Tim đập nhanh, hồi hộp', 'Tiểu đêm nhiều lần', 'Chán ăn, buồn nôn', 'Đau ngực (nếu có bệnh mạch vành đi kèm)', 'Sưng tĩnh mạch cổ'],
        normalize_benh_name('Sốt xuất huyết'): ['Sốt cao đột ngột (39-40 độ C)', 'Đau đầu dữ dội (vùng trán, sau hốc mắt)', 'Đau sau hốc mắt', 'Đau cơ khớp dữ dội', 'Nổi ban đỏ dưới da (thường sau 2-3 ngày sốt)', 'Xuất huyết dưới da (chấm đỏ li ti hoặc mảng bầm tím)', 'Chảy máu cam, chảy máu chân răng', 'Buồn nôn', 'Nôn', 'Đau bụng (vùng thượng vị hoặc hạ sườn phải)'],
        normalize_benh_name('Tay chân miệng'): ['Sốt (nhẹ đến vừa)', 'Đau họng', 'Loét miệng (trong miệng, lưỡi, nướu)', 'Phát ban (mụn nước hoặc nốt đỏ) ở lòng bàn tay, bàn chân, mông', 'Quấy khóc (ở trẻ nhỏ)', 'Biếng ăn', 'Chảy nước dãi nhiều', 'Mệt mỏi', 'Nôn'],
        normalize_benh_name('Sởi'): ['Sốt cao', 'Ho', 'Sổ mũi', 'Viêm kết mạc (mắt đỏ, chảy nước mắt)', 'Hạt Koplik (đốm trắng nhỏ trong miệng - dấu hiệu sớm)', 'Phát ban đỏ lan dần từ mặt, sau tai xuống thân mình', 'Chảy nước mắt', 'Sợ ánh sáng', 'Mệt mỏi', 'Viêm họng'],
        normalize_benh_name('Rubella'): ['Phát ban đỏ nhạt', 'Sốt nhẹ', 'Sưng hạch cổ (đặc biệt ở sau tai và sau gáy)', 'Đau khớp (thường ở phụ nữ)', 'Viêm kết mạc nhẹ', 'Mệt mỏi', 'Sổ mũi', 'Đau đầu', 'Ngứa da', 'Đau cơ'],
        normalize_benh_name('Thủy đậu'): ['Phát ban mụn nước (nốt đỏ phát triển thành mụn nước, sau đó đóng vảy, gây ngứa)', 'Sốt nhẹ', 'Ngứa ngáy dữ dội', 'Mệt mệt', 'Đau đầu', 'Mất cảm giác ngon miệng', 'Đau bụng nhẹ', 'Khó chịu', 'Mụn nước vỡ ra gây loét'],
        normalize_benh_name('Sốt rét'): ['Sốt cao (thường theo chu kỳ: rét run -> sốt nóng -> vã mồ hôi)', 'Rét run dữ dội', 'Vã mồ hôi', 'Đau đầu', 'Đau cơ', 'Buồn nôn', 'Nôn', 'Tiêu chảy', 'Vàng da nhẹ', 'Thiếu máu', 'Lách to, ấn đau'],
        normalize_benh_name('Sốt mò'): ['Sốt (thường cao đột ngột)', 'Vết loét đặc trưng (eschar) nơi mò đốt (vết loét đen, không đau, có vảy)', 'Phát ban (nốt đỏ lan từ thân ra ngoài)', 'Đau đầu', 'Đau cơ', 'Sưng hạch (gần vết đốt)', 'Mệt mỏi', 'Ho khan', 'Khó thở (nếu biến chứng viêm phổi)', 'Viêm phổi', 'Đau bụng'],
        normalize_benh_name('Tiểu đường Type 2'): ['Khát nước nhiều', 'Đi tiểu thường xuyên (đặc biệt ban đêm)', 'Mệt mỏi', 'Mờ mắt', 'Tê bì chân tay (đặc biệt ở bàn chân)', 'Vết thương lâu lành', 'Sụt cân không rõ nguyên nhân', 'Nhiễm trùng thường xuyên (da, tiết niệu, nấm)', 'Da khô ngứa', 'Huyết áp cao', 'Cholesterol cao'],
        normalize_benh_name('Suy giáp'): ['Mệt mỏi, thiếu năng lượng', 'Tăng cân không rõ nguyên nhân', 'Da khô, thô ráp', 'Táo bón', 'Rụng tóc', 'Sợ lạnh', 'Trí nhớ kém, khó tập trung', 'Kinh nguyệt không đều (ở nữ)', 'Giọng nói khàn', 'Phù mặt, mắt cá chân', 'Nhịp tim chậm'],
        normalize_benh_name('Cường giáp'): ['Mệt mỏi', 'Sụt cân không rõ nguyên nhân', 'Tim đập nhanh, hồi hộp', 'Khó ngủ, mất ngủ', 'Run tay', 'Đổ mồ hôi nhiều', 'Mắt lồi (Bệnh Graves)', 'Bướu cổ', 'Tiêu chảy', 'Lo lắng, bồn chồn', 'Nhạy cảm với nóng'],
        normalize_benh_name('Viêm đường tiết niệu'): ['Tiểu buốt', 'Tiểu rắt', 'Tiểu nhiều lần', 'Đau bụng dưới (vùng bàng quang)', 'Nước tiểu đục, có mùi hôi hoặc lẫn máu', 'Sốt (nếu nhiễm trùng lan lên thận)', 'Đau lưng (vùng thận)', 'Buồn nôn', 'Nôn'],
        normalize_benh_name('Sỏi thận'): ['Đau lưng (vùng hông lưng, đau dữ dội)', 'Đau bụng dưới (lan xuống bẹn)', 'Tiểu ra máu', 'Tiểu buốt', 'Buồn nôn', 'Nôn', 'Sốt', 'Ớn lạnh', 'Tiểu ngắt quãng'],
        normalize_benh_name('Đau nửa đầu (Migraine)'): ['Đau đầu dữ dội một bên (thường là đau nhói, theo nhịp mạch đập)', 'Buồn nôn', 'Nôn', 'Sợ ánh sáng', 'Sợ tiếng động', 'Nhìn mờ hoặc có hào quang trước mắt (aura)', 'Chóng mặt', 'Đau nhói', 'Đau theo nhịp mạch đập', 'Ảo giác thị giác/khứu giác'],
        normalize_benh_name('Parkinson'): ['Run tay chân (thường khi nghỉ ngơi)', 'Cứng cơ', 'Đi lại chậm chạp, khó khăn (bước đi nhỏ, lê bước)', 'Khó khăn trong việc giữ thăng bằng', 'Rối loạn giấc ngủ', 'Nói khó, nói nhỏ, đơn điệu', 'Mất biểu cảm khuôn mặt (khuôn mặt "mặt nạ")', 'Trầm cảm', 'Táo bón', 'Tiểu không tự chủ', 'Chữ viết nhỏ dần'],
        normalize_benh_name('Alzheimer'): ['Suy giảm trí nhớ (đặc biệt là trí nhớ gần)', 'Mất phương hướng về thời gian và địa điểm', 'Khó khăn trong giao tiếp (tìm từ, nói, viết)', 'Thay đổi tính cách và tâm trạng', 'Gặp khó khăn với các công việc hàng ngày quen thuộc', 'Nhầm lẫn về thời gian và địa điểm', 'Giảm khả năng phán đoán', 'Rút lui khỏi công việc/xã hội'],
        normalize_benh_name('Thoái hóa khớp'): ['Đau khớp (thường tăng khi vận động, giảm khi nghỉ ngơi)', 'Cứng khớp (đặc biệt vào buổi sáng hoặc sau khi ngồi lâu)', 'Giảm biên độ vận động khớp', 'Có tiếng lạo xạo hoặc lục khục khi cử động khớp', 'Sưng khớp (có thể có hoặc không)', 'Đau tăng khi vận động', 'Đau giảm khi nghỉ ngơi', 'Biến dạng khớp (giai đoạn muộn)', 'Yếu cơ xung quanh khớp'],
        normalize_benh_name('Loãng xương'): ['Thường không có triệu chứng cho đến khi gãy xương', 'Đau lưng mãn tính (do lún xẹp đốt sống)', 'Chiều cao giảm dần theo thời gian', 'Gãy xương (đặc biệt là xương hông, xương cổ tay, cột sống) chỉ sau chấn thương nhẹ', 'Còng lưng (gù vẹo cột sống)'],
        normalize_benh_name('Gout'): ['Đau khớp dữ dội (thường ở một khớp, phổ biến nhất là ngón chân cái)', 'Sưng đỏ', 'Nóng ran vùng khớp', 'Khó vận động khớp', 'Thường gặp ở ngón chân cái', 'Cơn đau thường khởi phát đột ngột vào ban đêm', 'Sốt nhẹ', 'Ớn lạnh', 'Xuất hiện hạt tophi (các cục u dưới da - gout mãn tính)', 'Đau khớp kéo dài (sau cơn cấp)'],
        normalize_benh_name('Ung thư vú'): ['U vú hoặc mảng dày lên ở vú (thường không đau)', 'Thay đổi hình dạng hoặc kích thước vú', 'Tiết dịch bất thường từ núm vú (đặc biệt là máu)', 'Đau vú (ít gặp)', 'Sưng hạch nách hoặc quanh xương đòn', 'Da vú bị sần sùi, lõm xuống (giống vỏ cam)', 'Núm vú bị tụt vào trong', 'Loét da vú'],
        normalize_benh_name('Ung thư tuyến tiền liệt'): ['Tiểu khó', 'Tiểu nhiều lần (đặc biệt vào ban đêm)', 'Dòng nước tiểu yếu hoặc ngắt quãng', 'Tiểu buốt hoặc cảm giác nóng rát khi tiểu', 'Tiểu ra máu hoặc tinh dịch lẫn máu', 'Đau vùng xương chậu hoặc thắt lưng (nếu di căn)', 'Rối loạn cương dương'],
        normalize_benh_name('Ung thư phổi'): ['Ho kéo dài (trên 2-3 tuần, thay đổi tính chất ho)', 'Ho ra máu hoặc đờm lẫn máu', 'Khó thở', 'Đau ngực (tăng khi ho hoặc hít sâu)', 'Khàn tiếng', 'Sụt cân không rõ nguyên nhân', 'Mệt mỏi', 'Nhiễm trùng hô hấp tái phát (viêm phổi, viêm phế quản)'],
        normalize_benh_name('Ung thư gan'): ['Đau bụng vùng thượng vị hoặc hạ sườn phải', 'Vàng da, vàng mắt', 'Sụt cân không rõ nguyên nhân', 'Mệt mỏi', 'Chán ăn', 'Gan to (sờ thấy)', 'Bụng báng (cổ trướng)', 'Buồn nôn', 'Nôn', 'Ngứa da', 'Nước tiểu sẫm màu', 'Phân bạc màu'],
        normalize_benh_name('Viêm da cơ địa (Eczema)'): ['Ngứa dữ dội (đặc biệt vào ban đêm)', 'Da khô, bong tróc', 'Phát ban đỏ (thường ở các nếp gấp da: khuỷu tay, khoeo chân, cổ)', 'Mụn nước nhỏ (có thể vỡ ra, chảy dịch)', 'Đóng vảy', 'Da dày lên, sần sùi (lichen hóa)', 'Da nứt nẻ, chảy máu', 'Chảy dịch', 'Sẹo', 'Mất ngủ'],
        normalize_benh_name('Nấm da'): ['Ngứa (ở vùng bị nấm)', 'Phát ban đỏ (hình vòng hoặc mảng không đều)', 'Vảy da', 'Thay đổi màu sắc da (sáng hơn hoặc sẫm màu hơn)', 'Móng dày, đổi màu (vàng, nâu) và dễ gãy (nấm móng)', 'Rụng tóc (ở vùng bị nấm đầu)', 'Xuất hiện mụn nước nhỏ (ở rìa vùng nấm)'],
    },
    'yeu_to_nguy_co': {
        normalize_benh_name('Cúm'): ['Tiếp xúc với người bệnh', 'Thời tiết lạnh', 'Hệ miễn dịch yếu', 'Không tiêm phòng cúm', 'Trẻ em', 'Người già', 'Bệnh nền mãn tính'],
        normalize_benh_name('Viêm phổi'): ['Thời tiết lạnh', 'Bệnh nền (tiểu đường, tim mạch, COPD)', 'Hút thuốc', 'Tuổi nhỏ hoặc cao', 'Hệ miễn dịch yếu', 'Nằm bất động lâu ngày', 'Hít phải chất lạ', 'Nhiễm virus cúm'],
        normalize_benh_name('COPD'): ['Hút thuốc lá (chủ động hoặc thụ động)', 'Ô nhiễm không khí (trong nhà hoặc ngoài trời)', 'Tiếp xúc hóa chất hoặc bụi nghề nghiệp', 'Tiền sử bệnh hô hấp (hen suyễn)', 'Yếu tố di truyền (thiếu Alpha-1 antitrypsin)'],
        normalize_benh_name('Hen suyễn'): ['Tiền sử gia đình mắc hen suyễn hoặc dị ứng', 'Dị ứng (phấn hoa, bụi nhà, lông động vật)', 'Ô nhiễm không khí', 'Khói thuốc lá', 'Thời tiết lạnh hoặc thay đổi đột ngột', 'Căng thẳng', 'Nhiễm trùng hô hấp', 'Gắng sức (hen suyễn do gắng sức)'],
        normalize_benh_name('Viêm phế quản'): ['Hút thuốc', 'Ô nhiễm không khí', 'Tiếp xúc với người bệnh (cảm cúm)', 'Hệ miễn dịch yếu', 'Tiền sử bệnh hô hấp (hen suyễn, dị ứng)', 'Thời tiết lạnh', 'Dị ứng', 'Trào ngược dạ dày thực quản'],
        normalize_benh_name('Viêm họng'): ['Tiếp xúc với người bệnh (do virus, vi khuẩn)', 'Thời tiết lạnh hoặc thay đổi đột ngột', 'Hệ miễn dịch yếu', 'Dị ứng', 'Hút thuốc lá (chủ động hoặc thụ động)', 'Ô nhiễm không khí', 'Khàn tiếng quá mức', 'Trào ngược dạ dày thực quản', 'Cắt amidan (làm giảm nguy cơ viêm họng do liên cầu)'],
        normalize_benh_name('Viêm xoang'): ['Dị ứng (viêm mũi dị ứng)', 'Polyp mũi', 'Vẹo vách ngăn mũi', 'Hút thuốc', 'Ô nhiễm không khí', 'Hệ miễn dịch yếu', 'Thời tiết lạnh', 'Thay đổi áp suất không khí đột ngột (đi máy bay, lặn)', 'Bơi lội thường xuyên', 'Nhiễm trùng răng'],
        normalize_benh_name('Lao phổi'): ['Hút thuốc', 'Uống rượu', 'Suy dinh dưỡng', 'Tiếp xúc gần gũi, kéo dài với người bệnh lao', 'Sống trong khu dân cư đông đúc, thiếu vệ sinh', 'Hệ miễn dịch yếu (HIV/AIDS, tiểu đường, sử dụng corticoid)', 'Bệnh phổi mãn tính (silicosis)', 'Lao động trong môi trường độc hại'],
        normalize_benh_name('Tiêu chảy'): ['Ăn uống mất vệ sinh', 'Nước bẩn', 'Tiếp xúc với người bệnh (qua phân)', 'Sử dụng thuốc kháng sinh (gây loạn khuẩn)', 'Du lịch đến vùng có dịch', 'Hệ miễn dịch yếu', 'Ăn đồ sống, chưa nấu chín kỹ'],
        normalize_benh_name('Ngộ độc thực phẩm'): ['Thức ăn để lâu ngoài môi trường', 'Chế biến không kỹ', 'Thực phẩm ôi thiu, hết hạn', 'Ăn đồ sống (gỏi, tiết canh)', 'Nước đá không đảm bảo vệ sinh', 'Tiếp xúc với người bệnh hoặc bề mặt nhiễm khuẩn'],
        normalize_benh_name('Viêm loét dạ dày'): ['Nhiễm vi khuẩn Helicobacter pylori', 'Sử dụng thuốc kháng viêm không steroid (NSAIDs)', 'Hút thuốc lá', 'Căng thẳng (stress)', 'Chế độ ăn thất thường, bỏ bữa', 'Uống nhiều rượu bia', 'Ăn nhiều đồ cay nóng', 'Tiền sử gia đình'],
        normalize_benh_name('Hội chứng ruột kích thích'): ['Stress', 'Lo âu', 'Trầm cảm', 'Chế độ ăn uống không đều đặn', 'Ăn nhiều đồ ăn nhanh, dầu mỡ', 'Uống nhiều đồ uống có gas', 'Sử dụng chất tạo ngọt nhân tạo', 'Không dung nạp lactose hoặc gluten', 'Nhiễm trùng đường ruột trước đó'],
        normalize_benh_name('Viêm gan A'): ['Ăn uống mất vệ sinh', 'Tiếp xúc với phân người bệnh', 'Du lịch đến vùng có dịch', 'Vệ sinh cá nhân kém', 'Sử dụng chung đồ dùng cá nhân', 'Quan hệ tình dục không an toàn (đặc biệt là quan hệ qua đường hậu môn)'],
        normalize_benh_name('Viêm gan B'): ['Tiêm chích ma túy (dùng chung kim tiêm)', 'Quan hệ tình dục không an toàn', 'Mẹ truyền sang con (khi sinh)', 'Truyền máu không an toàn (trước 1992)', 'Xăm mình', 'Xỏ khuyên', 'Sử dụng chung dao cạo, bàn chải đánh răng, bấm móng tay', 'Làm việc trong ngành y tế có tiếp xúc máu'],
        normalize_benh_name('Viêm gan C'): ['Tiêm chích ma túy (dùng chung kim tiêm)', 'Truyền máu không an toàn (trước 1992)', 'Quan hệ tình dục không an toàn (ít phổ biến hơn B)', 'Xăm mình', 'Xỏ khuyên', 'Mẹ truyền sang con (ít phổ biến hơn B)', 'Sử dụng chung kim tiêm, ống tiêm', 'Làm việc trong ngành y tế có tiếp xúc máu', 'HIV dương tính'],
        normalize_benh_name('Tăng huyết áp'): ['Chế độ ăn nhiều muối', 'Ít vận động', 'Thừa cân béo phì', 'Hút thuốc lá', 'Tiền sử gia đình', 'Stress', 'Tuổi cao', 'Uống nhiều rượu bia', 'Bệnh tiểu đường', 'Bệnh thận mãn tính', 'Ngưng thở khi ngủ'],
        normalize_benh_name('Bệnh mạch vành'): ['Tăng huyết áp', 'Cholesterol cao', 'Tiểu đường', 'Hút thuốc lá', 'Thừa cân béo phì', 'Ít vận động', 'Tiền sử gia đình', 'Tuổi cao', 'Stress', 'Uống nhiều rượu bia', 'Chế độ ăn không lành mạnh'],
        normalize_benh_name('Đột quỵ'): ['Tăng huyết áp', 'Bệnh tim mạch (rung nhĩ, suy tim)', 'Tiểu đường', 'Hút thuốc lá', 'Thừa cân béo phì', 'Ít vận động', 'Tiền sử đột quỵ hoặc cơn thiếu máu não thoáng qua', 'Tuổi cao', 'Rối loạn nhịp tim (rung nhĩ)', 'Cholesterol cao', 'Thuốc tránh thai'],
        normalize_benh_name('Suy tim'): ['Bệnh tim mạch (bệnh mạch vành, bệnh van tim, bệnh cơ tim)', 'Tăng huyết áp', 'Tiểu đường', 'Tiền sử gia đình', 'Thừa cân béo phì', 'Hút thuốc lá', 'Uống nhiều rượu bia', 'Rối loạn nhịp tim', 'Thiếu máu nặng', 'Bệnh tuyến giáp'],
        normalize_benh_name('Sốt xuất huyết'): ['Sống trong vùng dịch tễ có muỗi Aedes aegypti', 'Ao tù nước đọng quanh nhà', 'Không có biện pháp phòng ngừa muỗi đốt (mùng, thuốc chống muỗi)', 'Thời tiết mưa'],
        normalize_benh_name('Tay chân miệng'): ['Vệ sinh kém', 'Môi trường tập thể (trường học, nhà trẻ)', 'Tiếp xúc với trẻ bệnh (qua nước bọt, phân, dịch mụn nước)', 'Mùa nóng'],
        normalize_benh_name('Sởi'): ['Không tiêm chủng đầy đủ', 'Tiếp xúc với người bệnh (qua đường hô hấp)', 'Trẻ nhỏ dưới 5 tuổi', 'Hệ miễn dịch yếu'],
        normalize_benh_name('Rubella'): ['Không tiêm phòng rubella', 'Tiếp xúc với người bệnh', 'Hệ miễn dịch yếu', 'Phụ nữ mang thai (nguy hiểm)'],
        normalize_benh_name('Thủy đậu'): ['Không tiêm phòng thủy đậu', 'Tiếp xúc với người bệnh (qua đường hô hấp hoặc dịch mụn nước)', 'Trẻ em dưới 10 tuổi', 'Hệ miễn dịch yếu'],
        normalize_benh_name('Sốt rét'): ['Sống ở vùng sốt rét', 'Bị muỗi Anopheles đốt', 'Không dùng màn chống muỗi khi ngủ', 'Đi rừng', 'Ngủ rẫy', 'Du lịch đến vùng sốt rét', 'Mang thai', 'Trẻ em'],
        normalize_benh_name('Sốt mò'): ['Sống hoặc làm việc ở vùng có nhiều bụi rậm, cỏ cao', 'Bị ấu trùng mò đỏ đốt', 'Không mặc quần áo bảo hộ khi làm việc ngoài trời', 'Không bôi thuốc chống côn trùng', 'Không dọn dẹp nhà cửa, vườn tược', 'Tiếp xúc với động vật gặm nhấm'],
        normalize_benh_name('Tiểu đường Type 2'): ['Thừa cân béo phì', 'Ít vận động', 'Tiền sử gia đình', 'Chế độ ăn nhiều đường', 'Chất béo', 'Tuổi cao (trên 45)', 'Tiền sử tiểu đường thai kỳ', 'Huyết áp cao', 'Cholesterol cao', 'Hội chứng buồng trứng đa nang', 'Tiền sử bệnh tim mạch'],
        normalize_benh_name('Suy giáp'): ['Bệnh tự miễn (Hashimoto)', 'Tiền sử gia đình', 'Giới tính nữ', 'Tuổi cao', 'Mang thai', 'Phẫu thuật tuyến giáp', 'Xạ trị vùng cổ', 'Sử dụng thuốc điều trị cường giáp', 'Thiếu I-ốt (ở vùng sâu, xa)'],
        normalize_benh_name('Cường giáp'): ['Bệnh Graves (phổ biến nhất)', 'Tiền sử gia đình', 'Giới tính nữ', 'Hút thuốc', 'Mang thai', 'Stress', 'Tiền sử viêm tuyến giáp'],
        normalize_benh_name('Viêm đường tiết niệu'): ['Vệ sinh kém', 'Quan hệ tình dục (đặc biệt ở nữ)', 'Nhịn tiểu', 'Uống ít nước', 'Tiền sử nhiễm trùng tiểu', 'Bệnh tiểu đường', 'Tắc nghẽn đường tiết niệu (sỏi, u xơ)', 'Sử dụng ống thông tiểu', 'Mãn kinh (ở nữ)', 'U xơ tiền liệt tuyến (ở nam)'],
        normalize_benh_name('Sỏi thận'): ['Uống ít nước', 'Chế độ ăn nhiều protein động vật, muối', 'Tiền sử gia đình', 'Bệnh gout', 'Bệnh cường tuyến cận giáp', 'Thừa cân béo phì', 'Nhiễm trùng đường tiết niệu mãn tính', 'Một số bệnh lý đường ruột (viêm ruột)'],
        normalize_benh_name('Đau nửa đầu (Migraine)'): ['Tiền sử gia đình', 'Stress', 'Thay đổi nội tiết tố (chu kỳ kinh nguyệt, thai kỳ, mãn kinh)', 'Thực phẩm (phô mai, sô cô la, rượu vang đỏ)', 'Thiếu ngủ', 'Ánh sáng mạnh', 'Tiếng ồn', 'Mùi hương mạnh', 'Thay đổi thời tiết', 'Căng thẳng'],
        normalize_benh_name('Parkinson'): ['Tuổi cao', 'Tiền sử gia đình', 'Yếu tố di truyền', 'Tiếp xúc thuốc trừ sâu', 'Kim loại nặng', 'Chấn thương đầu', 'Giới tính nam'],
        normalize_benh_name('Alzheimer'): ['Tuổi cao', 'Tiền sử gia đình', 'Yếu tố di truyền (một số gen)', 'Bệnh tim mạch (huyết áp cao, cholesterol cao)', 'Tiểu đường', 'Chấn thương đầu nặng', 'Ít hoạt động trí óc và xã hội', 'Hút thuốc'],
        normalize_benh_name('Thoái hóa khớp'): ['Tuổi cao', 'Thừa cân béo phì', 'Chấn thương khớp', 'Lao động nặng, lặp đi lặp lại', 'Yếu tố di truyền', 'Dị tật bẩm sinh khớp', 'Bệnh viêm khớp khác (viêm khớp dạng thấp)'],
        normalize_benh_name('Loãng xương'): ['Tuổi cao', 'Giới tính nữ', 'Thiếu canxi', 'Thiếu vitamin D', 'Ít vận động', 'Hút thuốc lá', 'Uống nhiều rượu bia', 'Mãn kinh sớm', 'Sử dụng corticoid lâu dài', 'Một số bệnh lý (cường giáp, bệnh thận)', 'Tiền sử gia đình'],
        normalize_benh_name('Gout'): ['Uống nhiều rượu bia', 'Ăn nhiều thịt đỏ, hải sản, nội tạng động vật', 'Tiền sử gia đình', 'Thừa cân béo phì', 'Bệnh thận', 'Sử dụng thuốc lợi tiểu', 'Tăng axit uric máu', 'Giới tính nam', 'Tuổi cao'],
        normalize_benh_name('Ung thư vú'): ['Giới tính nữ', 'Tuổi cao', 'Tiền sử gia đình (mẹ, chị, em gái)', 'Mang gen đột biến BRCA1, BRCA2', 'Kinh nguyệt sớm (trước 12 tuổi)', 'Mãn kinh muộn (sau 55 tuổi)', 'Không sinh con hoặc sinh con đầu lòng muộn (sau 30 tuổi)', 'Sử dụng hormone thay thế sau mãn kinh', 'Béo phì sau mãn kinh', 'Uống nhiều rượu bia'],
        normalize_benh_name('Ung thư tuyến tiền liệt'): ['Giới tính nam', 'Tuổi cao (trên 50)', 'Tiền sử gia đình (cha, anh em)', 'Chủng tộc (người Mỹ gốc Phi)', 'Chế độ ăn nhiều chất béo'],
        normalize_benh_name('Ung thư phổi'): ['Hút thuốc lá (chủ động hoặc thụ động)', 'Tiếp xúc Radon', 'Tiếp xúc Asbestos', 'Ô nhiễm không khí', 'Tiền sử gia đình', 'Tiền sử mắc bệnh phổi mãn tính (COPD, lao)', 'Xạ trị vùng ngực'],
        normalize_benh_name('Ung thư gan'): ['Viêm gan B mãn tính', 'Viêm gan C mãn tính', 'Xơ gan do bất kỳ nguyên nhân nào', 'Uống nhiều rượu bia', 'Ngộ độc Aflatoxin (do nấm mốc trong thực phẩm)', 'Tiểu đường', 'Béo phì'],
        normalize_benh_name('Viêm da cơ địa (Eczema)'): ['Tiền sử gia đình mắc viêm da cơ địa, hen suyễn, dị ứng', 'Cơ địa dị ứng', 'Da khô', 'Thời tiết khô hanh hoặc thay đổi đột ngột', 'Stress', 'Tiếp xúc chất gây kích ứng (xà phòng, hóa chất, vải len)', 'Nhiễm trùng da'],
        normalize_benh_name('Nấm da'): ['Thời tiết ẩm ướt, nóng', 'Vệ sinh kém', 'Mặc quần áo chật', 'Ẩm ướt', 'Hệ miễn dịch yếu (tiểu đường, HIV/AIDS)', 'Sử dụng chung đồ dùng cá nhân (khăn, giày)', 'Tiếp xúc với người hoặc động vật bị nấm', 'Ra mồ hôi nhiều'],
    },
    'thoi_gian': {'start': '2023-01-01', 'end': '2024-12-31'},
    'phan_phoi': {
        'benh': {  # Tỷ lệ mắc bệnh chung (tổng phải là 1)
            'ho_hap': 0.20,
            'tieu_hoa': 0.15,
            'tim_mach': 0.12,
            'truyen_nhiem': 0.18,
            'noi_tiet': 0.08,
            'than_tiet_nieu': 0.05,
            'than_kinh': 0.03,
            'xuong_khop': 0.07,
            'ung_thu': 0.06,
            'da_lieu': 0.06
        },
        'vung_mien': { # Tỷ lệ dân số (tổng phải là 1)
            'mien_bac': 0.35,
            'mien_trung': 0.30,
            'mien_nam': 0.35
        },
        'benh_theo_mien': { # Ưu tiên TỶ LỆ MẮC danh mục bệnh theo miền (trọng số tương đối)
            'mien_bac': {'ho_hap': 1.5, 'tim_mach': 1.2, 'ung_thu': 1.1},
            'mien_trung': {'ho_hap': 1.8, 'tieu_hoa': 1.5, 'truyen_nhiem': 1.5},
            'mien_nam': {'truyen_nhiem': 1.8, 'tieu_hoa': 1.5, 'da_lieu': 1.2}
        },
        'benh_theo_mua': { # Ưu tiên TỶ LỆ MẮC bệnh cụ thể theo mùa (trọng số tương đối, key là tên bệnh đã chuẩn hóa)
            'Đông-Xuân': {normalize_benh_name('Cúm'): 2.0, normalize_benh_name('Viêm phổi'): 1.8, normalize_benh_name('Viêm họng'): 1.8, normalize_benh_name('Viêm phế quản'): 1.5, normalize_benh_name('Hen suyễn'): 1.3, normalize_benh_name('Đột quỵ'): 1.2, normalize_benh_name('Sởi'): 1.5, normalize_benh_name('Rubella'): 1.3},
            'Xuân-Hè': {normalize_benh_name('Tay chân miệng'): 2.0, normalize_benh_name('Tiêu chảy'): 1.5, normalize_benh_name('Ngộ độc thực phẩm'): 1.5, normalize_benh_name('Thủy đậu'): 1.5, normalize_benh_name('Sốt xuất huyết'): 1.2, normalize_benh_name('Nấm da'): 1.2},
            'Hè-Thu': {normalize_benh_name('Sốt xuất huyết'): 2.0, normalize_benh_name('Tiêu chảy'): 1.8, normalize_benh_name('Ngộ độc thực phẩm'): 1.8, normalize_benh_name('Tay chân miệng'): 1.2, normalize_benh_name('Sốt mò'): 1.5, normalize_benh_name('Viêm gan A'): 1.2, normalize_benh_name('Nấm da'): 1.3},
            'Thu-Đông': {normalize_benh_name('Cúm'): 1.5, normalize_benh_name('Viêm phổi'): 1.5, normalize_benh_name('Viêm họng'): 1.5, normalize_benh_name('Viêm phế quản'): 1.3, normalize_benh_name('Hen suyễn'): 1.2, normalize_benh_name('Đột quỵ'): 1.1, normalize_benh_name('Sốt xuất huyết'): 1.3},
        }
    }
}


def choose_with_probability(options, probabilities):
    """Chọn một phần tử từ danh sách dựa trên xác suất."""
    # Lọc bỏ các tùy chọn có xác suất âm hoặc None
    valid_pairs = [(options[i], probabilities[i]) for i in range(len(options)) if probabilities[i] is not None and probabilities[i] >= 0]

    if not valid_pairs:
        # print("Error: No valid options to choose from (probabilities non-positive or empty).")
        return None

    valid_options, valid_probabilities = zip(*valid_pairs) # Unzip back into separate lists

    total_prob = sum(valid_probabilities)
    if total_prob <= 0: # Handle cases where all valid probabilities are zero or negative
        if valid_options:
            # print("Warning: Valid probabilities sum to 0 or less. Choosing uniformly from valid options.")
            return random.choice(valid_options)
        else:
            # print("Error: No valid options to choose from.")
            return None # Indicate no options available

    # Ensure options and probabilities have the same length after filtering None
    # This check might be redundant after filtering, but good practice
    if len(valid_options) != len(valid_probabilities):
         print(f"Lỗi: Chiều dài valid_options ({len(valid_options)}) và valid_probabilities ({len(valid_probabilities)}) không khớp.")
         return None

    normalized_probabilities = [p / total_prob for p in valid_probabilities]

    return random.choices(valid_options, weights=normalized_probabilities, k=1)[0]


def check_schema(schema):
    """Kiểm tra tính hợp lệ và đầy đủ của schema."""
    print("--- Kiểm tra Schema ---")

    # 1. Collect all normalized disease keys from schema['benh']
    all_diseases_keys = set()
    for category, diseases in schema['benh'].items():
        if not isinstance(diseases, list) or not diseases:
             print(f"CẢNH BÁO CẤU TRÚC: Danh mục bệnh '{category}' trong schema['benh'] không phải là danh sách hoặc rỗng.")
             continue
        for disease_key in diseases: # These are already normalized keys
             if not isinstance(disease_key, str) or not disease_key:
                  print(f"CẢNH BÁO CẤU TRÚC: Key bệnh không hợp lệ trong danh mục '{category}': '{disease_key}'.")
                  continue
             all_diseases_keys.add(disease_key)

    # 2. Check if all diseases have symptom/risk info (using the collected normalized keys)
    missing_symptoms = [key for key in all_diseases_keys if key not in schema['trieu_chung']]
    missing_risks = [key for key in all_diseases_keys if key not in schema['yeu_to_nguy_co']]

    if missing_symptoms:
        print(f"LỖI NGHIÊM TRỌNG: Thiếu thông tin triệu chứng cho các key bệnh: {missing_symptoms}")
    else:
        print("Schema OK: Đầy đủ thông tin triệu chứng cho tất cả bệnh được liệt kê.")

    if missing_risks:
         print(f"LỖI NGHIÊM TRỌNG: Thiếu thông tin yếu tố nguy cơ cho các key bệnh: {missing_risks}")
    else:
        print("Schema OK: Đầy đủ thông tin yếu tố nguy cơ cho tất cả bệnh được liệt kê.")

    # 3. Check if symptom/risk lists are empty for keys that exist and are listed in schema['benh']
    empty_symptoms_list = [key for key in all_diseases_keys if key in schema['trieu_chung'] and not schema['trieu_chung'][key]]
    empty_risks_list = [key for key in all_diseases_keys if key in schema['yeu_to_nguy_co'] and not schema['yeu_to_nguy_co'][key]]


    if empty_symptoms_list:
         print(f"Cảnh báo: Danh sách triệu chứng rỗng cho các key bệnh: {empty_symptoms_list}")
    if empty_risks_list:
         print(f"Cảnh báo: Danh sách yếu tố nguy cơ rỗng cho các key bệnh: {empty_risks_list}")

    # 4. Check if categories/disease keys in phan_phoi exist in schema['benh'] or symptom/risk lists
    for category in schema['phan_phoi'].get('benh', {}): # Use .get for safety
         if category not in schema['benh']:
              print(f"CẢNH BÁO CẤU TRÚC: Danh mục bệnh '{category}' trong phân phối chung không tồn tại trong schema['benh'].")

    for mien, categories_weights in schema['phan_phoi'].get('benh_theo_mien', {}).items(): # Use .get for safety
         if mien not in schema['vung_mien']:
              print(f"CẢNH BÁO CẤU TRÚC: Miền '{mien}' trong phân phối theo miền không tồn tại trong schema['vung_mien'].")
         if not isinstance(categories_weights, dict):
              print(f"CẢNH BÁO CẤU TRÚC: Giá trị phân phối theo miền cho miền '{mien}' không phải là từ điển.")
              continue
         for category in categories_weights:
              if category not in schema['benh']:
                   print(f"CẢNH BÁO CẤU TRÚC: Danh mục bệnh '{category}' trong phân phối theo miền '{mien}' không tồn tại trong schema['benh'].")

    for mua, benh_weights in schema['phan_phoi'].get('benh_theo_mua', {}).items(): # Use .get for safety
         if not isinstance(benh_weights, dict):
              print(f"CẢNH BẢO CẤU TRÚC: Giá trị phân phối theo mùa cho mùa '{mua}' không phải là từ điển.")
              continue
         for benh_key in benh_weights:
              # Check if the disease key exists in the list of all diseases keys
              if benh_key not in all_diseases_keys:
                   print(f"CẢNH BÁO CẤU TRÚC: Key bệnh '{benh_key}' trong phân phối theo mùa '{mua}' không tồn tại trong danh sách các key bệnh trong schema['benh'].")


    print("--- Kết thúc kiểm tra Schema ---")


def generate_fake_record(schema):
    """Tạo một bản ghi dữ liệu giả."""
    record = {}
    record['gioi_tinh'] = random.choice(schema['gioi_tinh'])
    record['do_tuoi'] = random.randint(schema['do_tuoi']['min'], schema['do_tuoi']['max'])

    # Chọn vùng miền theo phân phối
    mien_options = list(schema['vung_mien'].keys())
    mien_probabilities = [schema['phan_phoi']['vung_mien'].get(mien, 0) for mien in mien_options]
    mien = choose_with_probability(mien_options, mien_probabilities)
    if mien is None: return None
    record['dia_diem'] = random.choice(schema['vung_mien'][mien])

    # Tạo thời gian ngẫu nhiên và xác định mùa
    start_date = datetime.strptime(schema['thoi_gian']['start'], '%Y-%m-%d')
    end_date = datetime.strptime(schema['thoi_gian']['end'], '%Y-%m-%d')
    time_between_dates = end_date - start_date
    random_days = random.randint(0, time_between_dates.days)
    record['thoi_gian'] = start_date + timedelta(days=random_days)
    record['mua'] = get_season(record['thoi_gian'])

    # --- Chọn bệnh dựa trên trọng số kết hợp ---
    all_diseases_keys = [b for category in schema['benh'].values() for b in category]
    disease_weights = []

    for benh_key in all_diseases_keys:
        base_weight = 1.0 # Default weight

        # 1. Adjust weight based on general category distribution
        category_weight = 0 # Default weight is 0 if not in any category in phan_phoi['benh']
        found_category = None
        for cat, benh_list in schema['benh'].items():
             if benh_key in benh_list:
                 found_category = cat
                 category_weight = schema['phan_phoi']['benh'].get(cat, 0)
                 break # Found the category


        # 2. Adjust weight based on regional preference (for the category the disease belongs to)
        regional_weight = 1.0 # Default regional multiplier is 1.0 (no change)
        if mien in schema['phan_phoi'].get('benh_theo_mien', {}): # Use .get for safety
             if found_category is not None:
                  regional_weight = schema['phan_phoi']['benh_theo_mien'][mien].get(found_category, 1.0)

        # 3. Adjust weight based on seasonal preference (for the specific disease)
        seasonal_weight = 1.0 # Default seasonal multiplier is 1.0 (no change)
        if record['mua'] in schema['phan_phoi'].get('benh_theo_mua', {}): # Use .get for safety
             seasonal_weight = schema['phan_phoi']['benh_theo_mua'][record['mua']].get(benh_key, 1.0)


        # Combine weights (multiplication)
        combined_weight = base_weight * category_weight * regional_weight * seasonal_weight

        disease_weights.append(combined_weight)


    # Select the disease based on combined weights
    record['benh'] = choose_with_probability(all_diseases_keys, disease_weights)
    if record['benh'] is None:
         # This can happen if all weights are 0. Return None so generate_fake_data retries.
         return None


    # Liên kết triệu chứng và yếu tố nguy cơ (benh_key is already normalized key)
    benh_key = record['benh']
    # Choose symptoms (min 1 if available, max 4)
    if benh_key in schema['trieu_chung'] and schema['trieu_chung'][benh_key]:
        trieu_chung_list = schema['trieu_chung'][benh_key]
        if trieu_chung_list: # Ensure the list is not empty
             # Choose a number of symptoms, min 1 (if available), max 4 (can be adjusted)
             num_trieu_chung = random.randint(1, min(4, len(trieu_chung_list)))
             record['trieu_chung'] = random.sample(trieu_chung_list, num_trieu_chung)
        else:
            record['trieu_chung'] = [] # List exists but is empty
    else:
        record['trieu_chung'] = [] # Should not happen if check_schema passes and lists are populated


    # Choose risk factors (min 1 if available, max 3)
    if benh_key in schema['yeu_to_nguy_co'] and schema['yeu_to_nguy_co'][benh_key]:
        yeu_to_nguy_co_list = schema['yeu_to_nguy_co'][benh_key]
        if yeu_to_nguy_co_list: # Ensure the list is not empty
             # Choose a number of risk factors, min 1 (if available), max 3 (can be adjusted)
             num_yeu_to = random.randint(1, min(3, len(yeu_to_nguy_co_list)))
             record['yeu_to_nguy_co'] = random.sample(yeu_to_nguy_co_list, num_yeu_to)
        else:
            record['yeu_to_nguy_co'] = [] # List exists but is empty
    else:
        record['yeu_to_nguy_co'] = [] # Should not happen if check_schema passes and lists are populated


    return record

def generate_fake_data(schema, num_records):
    """Tạo một DataFrame chứa dữ liệu giả."""
    data = []
    generated_count = 0
    attempt_limit = num_records * 10 # Increased attempt limit for robustness
    attempts = 0

    print(f"Generating {num_records} records...")
    while generated_count < num_records and attempts < attempt_limit:
        record = generate_fake_record(schema)
        if record is not None:
             data.append(record)
             generated_count += 1
             # print(f"Generated {generated_count}/{num_records} records", end='\r') # Optional progress
        attempts += 1

        # Print progress every 1000 records generated, or every 10000 attempts
        if generated_count > 0 and generated_count % 1000 == 0:
             print(f"Generated {generated_count}/{num_records} records...", end='\r')
        # elif attempts % 10000 == 0:
        #      print(f"Attempt {attempts}, generated {generated_count}/{num_records} records...", end='\r')


    print(f"\nFinished generation. Generated {generated_count} records.")
    if generated_count < num_records:
        print(f"Warning: Could not generate {num_records} records. Stopped after {attempts} attempts.")

    return pd.DataFrame(data)

# --- Script Execution ---

# Check schema BEFORE generation
print("Checking schema...")
check_schema(schema)
print("-" * 20)


# Tạo 50000 bản ghi
num_records = 50000
fake_data = generate_fake_data(schema, num_records)

# In ra một vài bản ghi để kiểm tra
print("\nGenerated Data Head:")
print(fake_data.head())
print("-" * 20)

# Lưu vào file CSV
file_name = 'fake_health_data_50k.csv'
print(f"Saving data to {file_name}...")
fake_data.to_csv(file_name, index=False)

print(f"Đã tạo và lưu {len(fake_data)} bản ghi vào file {file_name}")