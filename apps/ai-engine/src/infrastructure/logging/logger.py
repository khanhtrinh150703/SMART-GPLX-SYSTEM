import logging
import logging_loki
import os

def setup_logger():
    # Lấy URL Loki từ biến môi trường (File .env)
    loki_url = os.getenv("LOKI_URL", "http://localhost:3100/loki/api/v1/push")

    handler = logging_loki.LokiHandler(
        url=loki_url,
        tags={"app": "smart-gplx", "module": "ai-engine"}, # Nhãn phân biệt với Backend
        version="1",
    )

    # Tạo logger chính
    logger = logging.getLogger("AI-Monitor")
    logger.setLevel(logging.INFO)
    
    # Thêm handler để đẩy log lên Loki
    logger.addHandler(handler)
    
    # (Tùy chọn) Thêm log ra màn hình console để debug nhanh
    console_handler = logging.StreamHandler()
    logger.addHandler(console_handler)
    
    return logger

# Khởi tạo một instance dùng chung
ai_logger = setup_logger()