import mongoose from 'mongoose';
const userSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        lastLogin:{
            type: Date,
            default: Date.now
        },
        isVerified:{
            type: Boolean,
            default: false
        },
        resetPasswordToken: String,
        resetPasswordTokenExpiresAt: Date,
        verifyToken: String,
        verifyTokenExpiresAt: Date
    },
    {timestamps:true}
)

export const User = mongoose.model('User',userSchema)