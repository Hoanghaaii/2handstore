import Cart from '../models/cart.model.js'; // Import model Cart
import Product from '../models/product.model.js';

// Thêm sản phẩm vào giỏ hàng
export const addItemToCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.userId; // Lấy userId từ middleware verifyToken

    try {
        // Lấy thông tin sản phẩm từ database
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const productPrice = product.price; // Lấy giá sản phẩm
        const availableQuantity = product.quantity; // Giả sử model Product có trường quantity
        // Kiểm tra số lượng yêu cầu không vượt quá số lượng có sẵn
        if (quantity > availableQuantity) {
            return res.status(400).json({ success: false, message: `Only ${availableQuantity} items are available` });
        }

        // Tìm cart của người dùng
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex > -1) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            const currentQuantity = cart.items[existingItemIndex].quantity;

            // Kiểm tra xem tổng số lượng sau khi cập nhật có vượt quá không
            if (currentQuantity + quantity > availableQuantity) {
                return res.status(400).json({ success: false, message: `Only ${availableQuantity - currentQuantity} more items can be added` });
            }

            cart.items[existingItemIndex].quantity += quantity; // Cập nhật số lượng sản phẩm
        } else {
            // Nếu sản phẩm chưa có, thêm mới
            cart.items.unshift({ 
                productId, 
                quantity, 
                price: productPrice, 
                imageUrl: product.imageUrl,
                productName: product.name,
            });
            console.log(cart)
        }

        // Cập nhật tổng giá
        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        // Lưu cart
        await cart.save();
        res.status(200).json({ success: true, cart });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeItemFromCart = async (req, res) => {
    const { productId } = req.params; // Lấy productId từ params
    const userId = req.userId; // Lấy userId từ middleware verifyToken

    try {
        // Tìm giỏ hàng của người dùng
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        // Kiểm tra xem sản phẩm có trong giỏ hàng không
        const existingItemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (existingItemIndex === -1) {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

        // Lọc bỏ sản phẩm không mong muốn
        cart.items.splice(existingItemIndex, 1); // Xóa sản phẩm tại vị trí đã tìm thấy

        // Cập nhật tổng giá
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

        // Lưu giỏ hàng
        await cart.save();

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("Error removing item from cart:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Lấy giỏ hàng của người dùng
export const getCart = async (req, res) => {
    const userId = req.userId; // Lấy userId từ middleware verifyToken

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        return res.status(200).json({ success: true, cart });
    } catch (error) {
        console.error("Error fetching cart:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
