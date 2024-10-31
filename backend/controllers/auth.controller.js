import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookie.js';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import bcrypt from 'bcryptjs';
import  User  from '../models/user.model.js'
import { sendResetPasswordEmail, sendVerificationEmail } from '../mailtrap/emails.js';
import crypto from 'crypto';
import { postImage} from './image.controller.js'


export const getUserById = async (req, res)=>{
    const  userId  = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const userResponse = {...user._doc};
        delete userResponse.password;
        res.status(200).json({ success: true, user: userResponse });
    } catch (error) {
        console.log("An error occurred: "+error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
}

export const signUp = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        if (!email || !password || !name) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verifyToken: verificationCode,
            verifyTokenExpiresAt: Date.now() + 3600000 // 1 hour
        });

        await user.save();
        // Generate token and set cookie
        generateTokenAndSetCookie(res, user._id);
        // Remove password before sending response
        const userResponse = { ...user._doc };
        delete userResponse.password;
        res.status(200).json({ success: true, message: "User saved", user: userResponse });
    } catch (error) {
        console.log("An error occurred: "+error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const signIn = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: "Invalid password" });
        }

        // Generate token and set cookie
        const token = generateTokenAndSetCookie(res, user._id); // Gọi hàm này để tạo token và thiết lập cookie
        user.lastLogin = new Date();
        await user.save();

        const userResponse = { ...user._doc };
        delete userResponse.password;

        // Trả về token trong phản hồi
        res.status(200).json({ success: true, message: "Logged in successfully", user: userResponse, token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};


export const signOut = async (req, res)=>{
    res.clearCookie('token');
    res.status(200).json({ success: true, message: "Logged out successfully" });
}

export const verifyEmail = async (req, res) => {
    console.log("Received body:", req.body); // Kiểm tra nội dung nhận được
    const { code } = req.body;  // Chỉ lấy trường code từ req.body
    try {
        const user = await User.findOne({ verifyToken: code, verifyTokenExpiresAt: { $gt: Date.now() } }); // Tìm kiếm người dùng
        console.log("User found:", user); // Kiểm tra xem người dùng có được tìm thấy không

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found or expired verification code" });
        }
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiresAt = undefined;
        await user.save();
        res.status(200).json({ success: true, message: `Email verified successfully: ${user.email}` });
    } catch (error) {
        console.log("Error occurred:", error.message); // Log lỗi
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const checkAuth= async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password")
    if (!user) return res.status(401).json({ success: false, message: "User not found" });
    res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(400).json({success: false, message: error.message});
    }
}

export const forgotPassword = async(req, res) => {
    const {email} = req.body
    try {
        const user = await User.findOne({email})
        if(!user) return res.status(401).json({ success: false, message: "User not found"})
        const resetPasswordToken = crypto.randomBytes(20).toString("hex")
        const resetPasswordTokenExpiresAt = Date.now() + 60 *60 * 1000
        user.resetPasswordToken = resetPasswordToken
        user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt
        await user.save()
        sendResetPasswordEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`)
        res.status(200).json({success:true, message:"Password reset link sent to your email"})
    } catch (error) {
        res.status(400).json({success: false, message:error.message})
    }
}

export const resetPassword = async(req, res) => {
    try {
        const {token} = req.params
    const {password} = req.body
    const user = await User.findOne({resetPasswordToken: token, resetPasswordTokenExpiresAt: {$gt: Date.now()}})
    if(!user) return res.status(401).json({ success: false, message: "Token not found or expired"})
    const hashedPassword = await bcrypt.hash(password, 10)
    user.password = hashedPassword
    user.resetPasswordToken = undefined
    user.resetPasswordTokenExpiresAt = undefined
    await user.save()
    res.status(200).json({success: true, message: "Password reset successfully"})
    } catch (error) {
        res.status(500).json({success: false, message:"An error occurred: "+ error.message })
    }
}

export const updateAccount = async (req, res) => {
    const { name, age, gender, phoneNumber, address } = req.body;
    const file = req.file;  // File ảnh đại diện
    console.log(file)
    const userId = req.params.id;  // ID người dùng từ URL
    try {
        // Tìm user theo userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Cập nhật ảnh đại diện nếu có file tải lên
        let avatar = user.avatar;  // Giữ ảnh cũ nếu không có ảnh mới
        if (file) {
            // Upload ảnh mới lên S3
            const imageRes = await postImage(req, 'avatar');  // Hàm postImage xử lý việc upload
            if (!imageRes.success) {
                return res.status(500).json({ success: false, message: "Avatar upload failed" });
            }
            console.log(imageRes)
            avatar = imageRes.imageUrl;  // Lưu đường dẫn ảnh mới
        }

        // Cập nhật thông tin: nếu có giá trị mới thì dùng, nếu không thì giữ giá trị cũ
        const updatedUser = await User.findByIdAndUpdate(userId, {
            name: name || user.name,               // Nếu không có tên mới, giữ tên cũ
            avatar: avatar,                        // Cập nhật avatar mới hoặc giữ cái cũ
            age: age || user.age,                  // Giữ giá trị cũ nếu không có giá trị mới
            gender: gender || user.gender,         // Giữ giá trị cũ nếu không có giá trị mới
            phoneNumber: phoneNumber || user.phoneNumber,  // Giữ giá trị cũ nếu không có giá trị mới
            address: address || user.address       // Giữ giá trị cũ nếu không có giá trị mới
        }, { new: true, runValidators: true });

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "Failed to update: user not found" });
        }

        // Trả về phản hồi thành công
        res.status(200).json({ success: true, message: "Account updated successfully", user: updatedUser });
    } catch (error) {
        console.error("An error occurred: " + error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

export const resendVerificationCode = async (req, res) => {
    const { email } = req.body;

    try {
        // Kiểm tra nếu email không được cung cấp
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        // Tìm người dùng dựa trên email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Kiểm tra xem người dùng đã xác minh chưa
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "User is already verified" });
        }

        // Tạo mã xác minh mới
        const verificationCode = generateVerificationCode();
        user.verifyToken = verificationCode;
        user.verifyTokenExpiresAt = Date.now() + 3600000; // 1 giờ
        await user.save();

        // Gửi email xác minh mới
        await sendVerificationEmail(user.email, verificationCode);

        res.status(200).json({ success: true, message: "Verification code resent successfully" });
    } catch (error) {
        console.log("An error occurred: " + error.message);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
