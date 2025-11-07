const User = require("../models/User");
const jwt = require("jsonwebtoken");

//HELPER FUNCTION: Generate JWT Token
const generateToken = (userId) => {
  // Sign a JWT token with user ID and secret key, set to expire in 30 days
  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  return jwt.sign(
    { id: userId }, //Payload - data stored in the token
    process.env.JWT_SECRET, // Secret key from environment variables .env
    { expiresIn: "30d" } // Token expires in 30 days
  );
};

// CONTROLLER: Register a new user
// @desc   Register a new user
// @route  POST /api/auth/register
// @access Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    // Create new user
    // const user = new User({ name, email, password });
    // await user.save(); // Save user to database
    const user = await User.create({ name, email, password });

    // Generate JWT token
    const token = generateToken(user._id);

    // Respond with user data and token
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// CONTROLLER: Login user
// @desc   Login user
// @route  POST /api/auth/login
// @access Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide email and password" });
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password"); // Include password field
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Check if password matches
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }
    // Generate JWT token
    const token = generateToken(user._id);

    // Respond with user data and token
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// CONTROLLER: Get current logged-in user
// @desc   Get current logged-in user
// @route  GET /api/auth/me
// @access Private(requires auth middleware)

exports.getMe = async (req, res) => {
  try {
    // req.user is set in the auth middleware after verifying the token
    const user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// CONTROLLER: Update user profile
// @desc   Update user profile
// @route  PUT /api/auth/me
// @access Private(requires auth middleware)
// exports.updateMe = async (req, res) => {
//   try {
//     const { name, bio, avatar } = req.body;

//     // Using findByIdAndUpdate for brevity
//     const updatedUser = await User.findByIdAndUpdate(
//       req.user.id,
//       { name, bio, avatar, updatedAt: Date.now() },
//       { new: true, runValidators: true } // Return the updated document
//     );

//     res.status(200).json({
//       success: true,
//       message: "User profile updated successfully",
//       data: {
//         updatedUser,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error", error: error.message });
//   }
// };


exports.updateMe = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;

    // Get current user
    const currentUser = await User.findById(req.user.id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) currentUser.name = name;
    if (bio !== undefined) currentUser.bio = bio;
    if (avatar) currentUser.avatar = avatar;
    currentUser.updatedAt = Date.now();

    // Save user
    await currentUser.save();

    // Return consistent structure (same as getMe)
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
        role: currentUser.role,
        bio: currentUser.bio,
        createdAt: currentUser.createdAt,
        updatedAt: currentUser.updatedAt
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};
