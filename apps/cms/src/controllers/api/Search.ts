import { Request, Response } from 'express';
import payload from 'payload';

export const Search = async (req: Request, res: Response) => {
  try {
    const { q, limit = 10, page = 1 } = req.query;

    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Query parameter "q" is required.' });
    }

    const searchQuery = q.trim();

    const pressReleases = await payload.find({
      collection: 'press-releases',
      where: {
        or: [
          {
            title: {
              contains: searchQuery,
            },
          },
          {
            'content.plaintext': {
              contains: searchQuery,
            },
          },
        ],
      },
      limit: Number(limit),
      page: Number(page),
    });

    const agencies = await payload.find({
      collection: 'agencies',
      where: {
        or: [
          {
            name: {
              contains: searchQuery,
            },
          },
          {
            acronym: {
              contains: searchQuery,
            },
          },
        ],
      },
      limit: Number(limit),
      page: Number(page),
    });

    const results = {
      pressReleases: pressReleases.docs,
      agencies: agencies.docs,
    };

    return res.status(200).json(results);
  } catch (error) {
    console.error('Error searching content:', error);
    return res.status(500).json({ error: 'An error occurred while searching.' });
  }
};
