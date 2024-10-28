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
        avatar: {
            type: String,
        },
        age:{
            type: Number,
            default: null
        },
        gender:{
            type: String,
            enum: ['Nam', 'Nữ', 'Khác'],
            default: null
        },
        phoneNumber:{
            type: String,
            default: null
        },
        address:{
            type: String,
            default: null
        },
        
        purchasedProducts: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number }, // Thêm trường quantity
                _id: false
            }
        ],
        soldProducts: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number }, // Thêm trường quantity
                _id: false
            }
        ],
        sellingProducts: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
                quantity: { type: Number }, // Thêm trường quantity
                _id: false
            }
        ],
        resetPasswordToken: String,
        resetPasswordTokenExpiresAt: Date,
        verifyToken: String,
        verifyTokenExpiresAt: Date
    },
    {timestamps:true}
)

const User = mongoose.model('User',userSchema)
export default User