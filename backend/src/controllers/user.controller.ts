import { Request, Response } from "express";
import { User } from "../models/User";
import { deleteUserById, findUserByEmail } from "../services/user.service";

export const getProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const user = await User.findById(req.userId).select("-password"); // הסרת הסיסמה מהתגובה
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("❌ Error in getProfile:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const { name, email, age } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, age },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("❌ Error in updateProfile:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("❌ Error in deleteUser:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error("❌ Error in getAllUsers:", JSON.stringify(error, null, 2));
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    console.log(req.body);

    if (!["super_admin", "coach", "trainee"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error(
      "❌ Error in updateUserRole:",
      JSON.stringify(error, null, 2)
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addTrainee = async (req: Request, res: Response) => {
  try {
    // @ts-ignore
    if (!["coach", "super_admin"].includes(req.user.role)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newTrainee = new User({ name, email, password, role: "trainee" });
    await newTrainee.save();

    res
      .status(201)
      .json({ message: "Trainee added successfully", user: newTrainee });
  } catch (error) {
    console.error("❌ Error in addTrainee:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
