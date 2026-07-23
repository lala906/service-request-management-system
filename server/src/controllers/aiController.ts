import { Request, Response } from 'express';

export const analyzeRequest = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        error: 'Title and description are required for AI analysis',
      });
    }

    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();

    if (titleLower.includes('vpn') || descLower.includes('vpn')) {
      return res.status(200).json({
        summary: 'Issues establishing VPN connection to corporate network.',
        suggestedCategory: 'NETWORK',
        suggestedPriority: 'HIGH',
        reason:
          'VPN connectivity issues prevent remote staff from accessing secure systems, warranting high priority.',
      });
    }

    if (
      titleLower.includes('internet') ||
      descLower.includes('internet') ||
      titleLower.includes('wifi') ||
      descLower.includes('wifi')
    ) {
      return res.status(200).json({
        summary: 'Internet or Wi-Fi connectivity outage/instability.',
        suggestedCategory: 'NETWORK',
        suggestedPriority: 'MEDIUM',
        reason:
          'Affects local work but offline backups or alternative tasks may remain possible.',
      });
    }

    if (
      titleLower.includes('laptop') ||
      descLower.includes('laptop') ||
      titleLower.includes('screen') ||
      descLower.includes('screen')
    ) {
      return res.status(200).json({
        summary: 'Hardware malfunction affecting company laptop.',
        suggestedCategory: 'HARDWARE',
        suggestedPriority: 'LOW',
        reason:
          'Single user hardware issue. Can be resolved via temporary loaner device.',
      });
    }

    return res.status(200).json({
      summary: 'General support inquiry.',
      suggestedCategory: 'OTHER',
      suggestedPriority: 'URGENT',
      reason:
        'General inquiry detected. Assigned the highest valid priority supported by the application.',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'AI Analysis engine failed',
      details: (error as Error).message,
    });
  }
};