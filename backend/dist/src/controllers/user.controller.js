"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTrainee = exports.updateUserRole = exports.getAllUsers = exports.deleteUser = exports.updateProfile = exports.getProfile = void 0;
const User_1 = require("../models/User");
const user_service_1 = require("../services/user.service");
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const user = yield User_1.User.findById(req.userId).select("-password"); // הסרת הסיסמה מהתגובה
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    }
    catch (error) {
        console.error("❌ Error in getProfile:", JSON.stringify(error, null, 2));
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const userId = req.userId;
        const { name, email, age } = req.body;
        const updatedUser = yield User_1.User.findByIdAndUpdate(userId, { name, email, age }, { new: true, runValidators: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "Profile updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error("❌ Error in updateProfile:", JSON.stringify(error, null, 2));
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateProfile = updateProfile;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const { id } = req.params;
        const deletedUser = yield (0, user_service_1.deleteUserById)(id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User deleted successfully" });
    }
    catch (error) {
        console.error("❌ Error in deleteUser:", JSON.stringify(error, null, 2));
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.deleteUser = deleteUser;
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find().select("-password");
        res.json(users);
    }
    catch (error) {
        console.error("❌ Error in getAllUsers:", JSON.stringify(error, null, 2));
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getAllUsers = getAllUsers;
const updateUserRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { role } = req.body;
        console.log(req.body);
        if (!["super_admin", "coach", "trainee"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }
        const updatedUser = yield User_1.User.findByIdAndUpdate(id, { role }, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ message: "User role updated successfully", user: updatedUser });
    }
    catch (error) {
        console.error("❌ Error in updateUserRole:", JSON.stringify(error, null, 2));
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateUserRole = updateUserRole;
const addTrainee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        if (!["coach", "super_admin"].includes(req.user.role)) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = yield (0, user_service_1.findUserByEmail)(email);
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const newTrainee = new User_1.User({ name, email, password, role: "trainee" });
        yield newTrainee.save();
        res
            .status(201)
            .json({ message: "Trainee added successfully", user: newTrainee });
    }
    catch (error) {
        console.error("❌ Error in addTrainee:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.addTrainee = addTrainee;
