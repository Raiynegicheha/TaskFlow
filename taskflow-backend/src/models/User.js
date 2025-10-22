import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';


// User Schema defines the structure of the user  document

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters'],
        minlength: [2, 'Name must be at least 2 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, //No duplicate emails
        trim: true,
        lowercase: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Do not return password field by default
    },
    avatar: {
        type: String,
        default: 'https://via.placeholder.com/150'
    }, // Placeholder for avatar URL or data
    role: {
        type: String,
        enum: ['user', 'admin'],// Only allow 'user' or 'admin'
        default: 'user'
    },
    bio:{
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
},
{ timestamps: true } // Automatically manage createdAt and updatedAt fields
);


// Pre-save hook to hash password before saving
// METHOD: Compare entered password with hashed password
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    //Generate salt(random data added to password before hashing)
    const salt = await genSalt(10);
    //Hash the password with the salt
    this.password = await hash(this.password, salt);
    next();
});

// Method to compare entered password with hashed password
//We'll use this method during login to verify user credentials
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await compare(enteredPassword, this.password);
};

//Method to return user data without password
//Method: Generate clean user object without password
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password; // Remove password field from response
    return user;
};

// Create and export User model
export default model('User', userSchema);