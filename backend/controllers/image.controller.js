import s3 from '../aws/aws.config.js';
import multer from 'multer';
import { PutObjectCommand } from '@aws-sdk/client-s3';



const storage = multer.memoryStorage();
const upload = multer({ storage });




export const postImage = async (req, prefix = '') => {
    const file = req.file;
    if (!file) {
        return { success: false, message: "No file uploaded" }; // Trả về đối tượng kết quả
    }

    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${prefix}/${file.originalname}`, // Tên file bao gồm cả prefix (thư mục trên S3)
        Body: file.buffer,                     // Dữ liệu file
        ContentType: file.mimetype,            // Loại file (MIME type)
    };

    try {
        const command = new PutObjectCommand(params); // Tạo lệnh upload ảnh lên S3
        await s3.send(command); // Upload file lên S3

        const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;

        return { 
            success: true, 
            message: "Image uploaded successfully", 
            imageUrl // Trả về đường dẫn ảnh đã upload lên S3 
        };
    } catch (err) {
        return { 
            success: false, 
            message: "Server error", 
            error: err.message 
        }; // Trả về đối tượng lỗi
    }
};






// Hàm lấy ảnh từ S3 với prefix
export const getImage = async (req, res, prefix = '') => {
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: prefix,
    };

    try {
        const data = await s3.listObjectsV2(params);

        // Kiểm tra nếu không có file nào
        if (!data.Contents || data.Contents.length === 0) {
            return res.status(404).json({ success: false, message: "No images found" });
        }

        // Tạo danh sách URL từ các file trong bucket
        const imageUrls = data.Contents.filter(item=>!item.Key.endsWith('/')).map(item => {
            return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`;
        });

        // Trả về danh sách URL ảnh
        return res.status(200).json({ success: true, images: imageUrls });
    } catch (err) {
        return res.status(500).json({ 
            success: false, 
            message: "Server error", 
            error: err.message 
        });
    }
};


// Middleware xử lý upload hình ảnh
export const uploadMiddleWare = upload.single('imageUrl');
