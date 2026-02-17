import { registerUser, verifyOtp, getUsers } from "../services/user.services.js";

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        if(!user) {
            return res.status(400).json({ message: "Could not register user"})
        }
        res.status(201).json({ 
            success: true,
            message: "User created successfully, kindly verify your account by entering your otp code" })
        
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: error.message
        })
    }
};

export const verify = async (req, res) => {
    try {
        const result = await verifyOtp(req.body);
        res.status(200).json(result);
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const user = await getUsers();

        return res.status(200).json(user);
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

