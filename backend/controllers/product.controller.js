import Product from '../models/product.model.js';
import { postImage} from './image.controller.js'
import User from '../models/user.model.js';

export const getProduct = async (req, res) => {
    try {
        const products = await Product.find({});
        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found" });
        }
        return res.status(200).json({ success: true, products });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getProductById = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id); // Chỉ cần truyền id
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        return res.status(200).json({ success: true, product });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductByCategory = async (req, res) => {
    const categoryName = req.params.category; // Lấy tên danh mục từ tham số đường dẫn
    try {
        // Tìm tất cả sản phẩm có danh mục chứa tên danh mục được cung cấp
        const products = await Product.find({ category: { $regex: categoryName, $options: 'i' } });

        // Kiểm tra nếu không tìm thấy sản phẩm
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found in this category" });
        }

        // Trả về danh sách sản phẩm tìm thấy
        return res.status(200).json({ success: true, products });
    } catch (error) {
        // Xử lý lỗi và trả về phản hồi lỗi
        return res.status(500).json({ success: false, message: error.message });
    }
};


export const getProductByName = async (req, res) => {
    const name = req.params.name; // Lấy tên từ tham số đường dẫn
    try {
        // Tìm tất cả sản phẩm có tên chứa từ khóa với regex
        const products = await Product.find({ name: { $regex: name, $options: 'i' } });

        // Kiểm tra nếu không tìm thấy sản phẩm
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        // Trả về danh sách sản phẩm tìm thấy
        return res.status(200).json({ success: true, products });
    } catch (error) {
        // Xử lý lỗi và trả về phản hồi lỗi
        console.error("An error occurred: " + error.message);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export const postProduct = async (req, res) => {
    const { name, description, price, category, quantity } = req.body;
    const file = req.file;
    const userId = req.userId;
    console.log(req.body)
    console.log(req.file)

    if (!name ||!description ||!price ||!category ||!quantity ||!file) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!userId) {
        return res.status(404).json({ success: false, message: "No user found!" });
    }

    try {
        // Tìm user theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const authorName = user.name; // Lấy tên tác giả

        // Upload ảnh lên S3
        const imageRes = await postImage(req, 'product');
        if (!imageRes.success) {
            return res.status(500).json({ success: false, message: "Image upload failed" });
        }

        // Tạo sản phẩm mới
        const newProduct = new Product({
            name,
            description,
            price,
            category,
            quantity,
            author: authorName,       // Lưu tên tác giả
            imageUrl: imageRes.imageUrl,  // Lưu đường dẫn ảnh
        });

        // Lưu sản phẩm vào MongoDB
        await newProduct.save();

        // Trả về phản hồi thành công
        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct
        });

    } catch (error) {
        console.error("An error occurred: " + error.message);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
