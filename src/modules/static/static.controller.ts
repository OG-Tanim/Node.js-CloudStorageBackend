import { Request, Response, NextFunction } from 'express';
import StaticPage from 'models/StaticPage';
import { sendResponse } from 'utils/sendResponse';

export const getStaticPage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { key } = req.params;

    const page = await StaticPage.findOne({ key });
    if (!page) {
      return res.status(404).json({ message: 'Static page not found' });
    }

    sendResponse(res, {
      statusCode: 200,
      message: `${page.title} retrieved successfully`,
      data: {
        title: page.title,
        content: page.content,
      },
    });
  } catch (err) {
    next(err);
  }
};
