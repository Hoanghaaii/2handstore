import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Lấy token từ cookies
    console.log("Received token:", token); // Ghi log token nhận được

    try {
        // Kiểm tra xem token có tồn tại không
        if (!token) {
            return res.status(401).json({ success: false, message: "Token not provided" });
        }

        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Nếu token không hợp lệ hoặc không thể giải mã
        if (!decoded) {
            return res.status(403).json({ success: false, message: "Token not valid" }); // Thay 401 bằng 403
        }

        // Lưu ID người dùng vào req để sử dụng trong các route tiếp theo
        req.userId = decoded.userId;
        next(); // Tiến hành đến middleware hoặc route tiếp theo
    } catch (error) {
        console.error("Error verifying token:", error.message); // Ghi log lỗi
        return res.status(500).json({ success: false, message: "Server error" }); // Thay đổi thông điệp để người dùng không thấy thông tin nhạy cảm
    }
};
