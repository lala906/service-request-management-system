import { Request, Response } from 'express';
import { ServiceRequest } from '../models/ServiceRequest';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const total = await ServiceRequest.countDocuments();

    const open = await ServiceRequest.countDocuments({
      status: 'OPEN',
    });

    const inProgress = await ServiceRequest.countDocuments({
      status: 'IN_PROGRESS',
    });

    const resolved = await ServiceRequest.countDocuments({
      status: 'RESOLVED',
    });

    const cancelled = await ServiceRequest.countDocuments({
      status: 'CANCELLED',
    });

    res.json({
      total,
      open,
      inProgress,
      resolved,
      cancelled,
    });
  } catch (err: any) {
   console.error(err);

res.status(500).json({
  error: 'Failed to load dashboard statistics',
});
  }
};