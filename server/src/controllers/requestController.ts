import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { ServiceRequest } from '../models/ServiceRequest';
import mongoose from 'mongoose';

export const createRequest = async (req: AuthRequest, res: Response) => {
  try {
    const {
  title,
  description,
  category,
  priority,
  aiSummary,
  aiSuggestedCategory,
  aiSuggestedPriority,
} = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: 'Title and description are required',
      });
    }

    const newRequest = new ServiceRequest({
      title,
      description,
     category: category || 'OTHER',
      priority: priority || 'MEDIUM',
      status: 'OPEN',
      aiSummary,
aiSuggestedCategory,
aiSuggestedPriority,
      createdBy: req.user?.id,
      statusHistory: [
        {
          status: 'OPEN',
          changedBy: new mongoose.Types.ObjectId(req.user?.id),
          note: 'Request created',
          changedAt: new Date(),
        },
      ],
    });

    const savedRequest = await newRequest.save();

    return res.status(201).json(savedRequest);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to create request',
      details: (error as Error).message,
    });
  }
};

export const getRequests = async (req: AuthRequest, res: Response) => {
  try {
    let requests;

    if (req.user?.role === 'ADMIN') {
      requests = await ServiceRequest.find();
    } else {
      requests = await ServiceRequest.find({
        createdBy: req.user?.id,
      });
    }

    requests = await ServiceRequest.populate(requests, [
      { path: 'createdBy', select: 'name email' },
      { path: 'assignedTo', select: 'name email' },
    ]);

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to fetch requests',
    });
  }
};

export const getRequestById = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const request = await ServiceRequest.findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name email');

    if (!request) {
      return res.status(404).json({
        error: 'Request not found',
      });
    }

    if (
      req.user?.role !== 'ADMIN' &&
      request.createdBy._id.toString() !== req.user?.id
    ) {
      return res.status(403).json({
        error: 'Access denied',
      });
    }

    return res.status(200).json(request);
  } catch (error) {
    return res.status(500).json({
      error: 'Error fetching request details',
      details: (error as Error).message,
    });
  }
};

export const updateRequestStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
const { assignedTo } = req.body;
    const { status } = req.body;
    if (req.user?.role !== 'ADMIN') {
  return res.status(403).json({
    error: 'Only admin can update status',
  });
}
    const validStatus = [
  'OPEN',
  'IN_REVIEW',
  'IN_PROGRESS',
  'RESOLVED',
  'CANCELLED',
];

if (!validStatus.includes(status)) {
  return res.status(400).json({
    error: 'Invalid status',
  });
}
    const request = await ServiceRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        error: 'Request not found',
      });
    }

    request.status = status;

    request.statusHistory.push({
      status,
      changedBy: new mongoose.Types.ObjectId(req.user?.id),
      note: `Status changed to ${status}`,
      changedAt: new Date(),
    });

    await request.save();
     return res.status(200).json({
  message: 'Status updated successfully',
  request,
});
 } catch (error) {
  return res.status(500).json({
    error: 'Failed to update status',
    details: (error as Error).message,
  });
}
};

export const assignRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const request = await ServiceRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        error: 'Request not found',
      });
    }

    return res.status(200).json({
      message: 'Request assignment simulated successfully (Mock)',
      request,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to assign request',
    });
  }
};

export const cancelRequest = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { id } = req.params;

    const request = await ServiceRequest.findById(id);

    if (!request) {
      return res.status(404).json({
        error: 'Request not found',
      });
    }

    if (
      req.user?.role !== 'ADMIN' &&
      request.createdBy.toString() !== req.user?.id
    ) {
      return res.status(403).json({
        error: 'Access denied',
      });
    }
     if (
    request.status === 'RESOLVED' ||
    request.status === 'CANCELLED'
) {
    return res.status(400).json({
        error: 'Request cannot be cancelled',
    });
}
    request.status = 'CANCELLED';

    request.statusHistory.push({
      status: 'CANCELLED',
      changedBy: new mongoose.Types.ObjectId(req.user?.id),
      note: 'Cancelled by user',
      changedAt: new Date(),
    });

    await request.save();

    return res.status(200).json(request);
  } catch (error) {
   return res.status(500).json({
error:'Failed to cancel request'
}); 
  }
};