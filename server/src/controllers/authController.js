const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("@/models/userModel");

const register = async (req, res) => {
    console.log(req.body);

    try {
        const { username, email, password, role = 'customer', contactNumber, address } = req.body;

        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email, and password.",
            });
        }

        // Check if the user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({
                message: "User with this email or username already exists.",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10); // bcrypt salt rounds

        // Create new user object
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role,
            contactNumber,
            address,
        });

        // Save the new user to the database
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign(
            {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h", // Token expires in 24 hours
            }
        );

        // Respond with the new user and token
        return res.status(201).json({
            message: "User registered successfully.",
            newUser,
            token,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error. Please try again later.",
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide email and password.",
            });
        }

        // Check if the user exists
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({
                message: "User with this email doesn't exist. Try signing up.",
            });
        }

        // Compare the provided password with the hashed password
        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(400).json({
                message: "Incorrect password. Please try again.",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h", // Token expires in 24 hours
            }
        );

        // Respond with login success and token
        return res.status(200).json({
            message: "Login successful.",
            token,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error. Please try again later.",
        });
    }
};

module.exports = {
    register,
    login,
};