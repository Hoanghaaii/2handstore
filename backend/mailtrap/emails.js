import { sender, client } from './mailtrap.config.js'
import User from '../models/user.model.js'
export const sendVerificationEmail = async (email, verificationToken) => {
    const recipients = [{ email }];
    const user = await User.findOne({ email });

    // Kiểm tra nếu không tìm thấy người dùng
    if (!user) {
        throw new Error("User not found");
    }

    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            template_uuid: "26d90089-6565-40e7-a4db-fc457be11c05",
            template_variables: {
                "user_name": user.name,
                "verification_code": verificationToken,
            }
        });
        console.log("Verify email sent successfully");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send verification email");
    }
};

export const sendResetPasswordEmail = async (email, resetURL) =>{
    const recipients = [{ email }];
    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            template_uuid: "7ffc5b82-b121-48cb-9f0a-780c9cbec8bf",
            template_variables: {
                "username": email,
                "resetLink": resetURL
              }
        });
        console.log("Reset password email sent successfully");
    } catch (error) {
        console.error(error);
        throw new Error("Failed to send reset password email");
    }
}
