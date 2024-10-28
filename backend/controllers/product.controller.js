import Product from '../models/product.model.js';
import { postImage } from './image.controller.js';
import User from '../models/user.model.js';

export const getProduct = async (req, res) => {
    try {
        // Lấy page và limit từ query params, mặc định page = 1 và limit = 10
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Tính toán số sản phẩm cần bỏ qua (skip)
        const skip = (page - 1) * limit;

        // Đếm tổng số sản phẩm
        const totalProducts = await Product.countDocuments();

        // Lấy sản phẩm với phân trang
        const products = await Product.find({})
            .sort({status:1, createdAt: -1 })
            .skip(skip)  // Bỏ qua các sản phẩm của các trang trước
            .limit(limit);  // Lấy số sản phẩm giới hạn trên mỗi trang

        // Kiểm tra nếu không có sản phẩm nào
        if (!products || products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        // Trả về dữ liệu cùng với thông tin phân trang
        return res.status(200).json({
            success: true,
            totalProducts,  // Tổng số sản phẩm
            totalPages: Math.ceil(totalProducts / limit),  // Tổng số trang
            currentPage: page,  // Trang hiện tại
            products  // Danh sách sản phẩm của trang hiện tại
        });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        // Tìm tất cả sản phẩm có danh mục chứa tên danh mục được cung cấp
        const products = await Product.find({
            category: { $regex: categoryName, $options: 'i' }
        })
        .sort({status:1, createdAt: -1 })
        .skip(skip)
        .limit(limit); // Lấy số sản phẩm giới hạn trên mỗi trang

        // Đếm tổng số sản phẩm trong danh mục
        const totalProducts = await Product.countDocuments({
            category: { $regex: categoryName, $options: 'i' }
        });

        // Kiểm tra nếu không tìm thấy sản phẩm
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found in this category" });
        }

        // Trả về danh sách sản phẩm tìm thấy cùng thông tin phân trang
        return res.status(200).json({
            success: true,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            products
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getProductByName = async (req, res) => {
    const name = req.params.name; // Lấy tên từ tham số đường dẫn
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    try {
        // Tìm tất cả sản phẩm có tên chứa từ khóa với regex
        const products = await Product.find({
            name: { $regex: name, $options: 'i' }
        })
        .sort({status:1, createdAt: -1 })
        .skip(skip)
        .limit(limit); // Lấy số sản phẩm giới hạn trên mỗi trang

        // Đếm tổng số sản phẩm có tên chứa từ khóa
        const totalProducts = await Product.countDocuments({
            name: { $regex: name, $options: 'i' }
        });

        // Kiểm tra nếu không tìm thấy sản phẩm
        if (products.length === 0) {
            return res.status(404).json({ success: false, message: "No products found" });
        }

        // Trả về danh sách sản phẩm tìm thấy cùng thông tin phân trang
        return res.status(200).json({
            success: true,
            totalProducts,
            totalPages: Math.ceil(totalProducts / limit),
            currentPage: page,
            products
        });
    } catch (error) {
        console.error("An error occurred: " + error.message);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const postProduct = async (req, res) => {
    const { name, description, price, category, quantity, location } = req.body;
    const file = req.file;
    const userId = req.userId;

    if (!name || !description || !price || !category || !quantity || !file || !location) {
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

        const authorEmail = user.email;

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
            location,
            quantity,
            author: authorEmail,       // Lưu tên tác giả
            imageUrl: imageRes.imageUrl,  // Lưu đường dẫn ảnh
        });

        // Lưu sản phẩm vào MongoDB
        await newProduct.save();
        user.sellingProducts.push({ productId: newProduct._id, quantity });
        await user.save();

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


export const getProductBySeller = async (req, res) => {
    const userId = req.userId; // Lấy userId từ req (middleware đã gán)

    try {
        // Tìm kiếm người dùng dựa trên userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Người dùng không tồn tại.' });
        }
        const email = user.email; // Lấy email từ đối tượng người dùng

        // Tìm tất cả sản phẩm của người bán dựa trên email
        const products = await Product.find({ author: email }).sort({status:1, createdAt: -1 });
        
        // Trả về danh sách sản phẩm
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by owner:', error);
        res.status(500).json({ error: 'Lỗi khi lấy sản phẩm.' });
    }
};

export const updateProduct = async (req, res)=>{
    const id = req.params.id
    const {name, description, price, category, quantity, location, status } = req.body;
    try {
    const product = await Product.findById(id)
    if(!product){
        return res.status(404).json({success: false, message: "Product not found"})
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.quantity = quantity !== undefined ? quantity : product.quantity;
    product.location = location || product.location;
    product.status = status || product.status;
    await product.save()
    return res.status(200).json({success: true, message: "Product updated successfully", product})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }

}

export const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        await Product.findByIdAndDelete(id); // Xóa sản phẩm
        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};