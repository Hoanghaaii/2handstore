import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // Lấy token từ header Authorization
    const token = req.headers.authorization?.split(' ')[1]; // Lấy phần token sau "Bearer "
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
            return res.status(403).json({ success: false, message: "Token not valid" });
        }

        // Lưu ID người dùng vào req để sử dụng trong các route tiếp theo
        req.userId = decoded.userId;
        next(); // Tiến hành đến middleware hoặc route tiếp theo
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
