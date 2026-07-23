import { Request, Response } from 'express';
import { User } from '../models/User';

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash');

    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch users',
      details: (error as Error).message,
    });
  }
};

export const toggleUserStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    return res.status(200).json({
      message: `User ${
        user.isActive ? 'Activated' : 'Deactivated'
      } Successfully`,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to update user status',
      details: (error as Error).message,
    });
  }
};

export const changeUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({
        error: 'Invalid Role',
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
      });
    }

    user.role = role;

    await user.save();

    return res.status(200).json({
      message: 'Role Updated Successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to update role',
      details: (error as Error).message,
    });
  }
};