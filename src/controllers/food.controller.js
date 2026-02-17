import * as foodServices from "../services/food.services.js";

export const createFood = async (req, res) => {
    try {
        req.user = { role: req.body.role }
        const food = await foodServices.createFood(req.body, req.user);

        res.status(201).json({
            success: true,
            food
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getAllFood = async (req, res) => {
    try {
        const food = await foodServices.getAllFood(req.query);

        return res.status(200).json({
            success: true,
            food
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const getSingleFood = async (req, res) => {
    try {
        const { id } = req.params;
        const food = await foodServices.getFoodById(id);

        return res.status(200).json({
            success: true,
            food
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const updateFood = async (req, res) => {
    try {
        const { id } = req.params;
        req.user = { role: req.body.role }
        const food = await foodServices.updateFood(id, req.body, req.user)

        return res.status(200).json({
            success: true,
            food
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};

export const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;
        req.user = { role: req.body.role }
        const deleted = await foodServices.deleteFood(id, req.user);

        return res.status(200).json({
            success: true,
            deleted
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
};