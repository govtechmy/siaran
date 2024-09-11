import payload from 'payload';

export const getPressReleases = async (req, res) => {
  try {
    const { page = 1, limit = 10, date } = req.query;

    let where = { //extract the where clause
      status: {
        equals: 'published',
      },
    };

    if (date) { //id date exist in query, add date into where clause
      const formattedDate = new Date(date); //have to receive in this format 2024-09-11 (YYYY-MM-DD)
      if (!isNaN(formattedDate.getTime())) {
        where['datetime'] = {
          gte: new Date(`${date}T00:00:00Z`), // start of the day
          lte: new Date(`${date}T23:59:59Z`), // end of the day range
        };
      } else {
        return res.status(400).json({ error: 'Invalid date format' });
      }
    }

    const pressReleases = await payload.find({
      collection: 'press-releases',
      where,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: '-datetime',
    });

    res.status(200).json(pressReleases);
  } catch (error) {
    console.error('Error fetching press releases:', error);
    res.status(500).json({ error: 'An error occurred while fetching press releases.' });
  }
};


export const getPressReleasesByAgency = async (req, res) => {
  try {
    const { agencyId, page = 1, limit = 10, date } = req.query;

    if (!agencyId) {
      return res.status(400).json({ error: 'Agency ID is required' });
    }

    let where = {
      relatedAgency: {
        equals: agencyId,
      },
      status: {
        equals: 'published',
      },
    };

    if (date) {
      const formattedDate = new Date(date);
      if (!isNaN(formattedDate.getTime())) {
        where['datetime'] = {
          gte: new Date(`${date}T00:00:00Z`), 
          lte: new Date(`${date}T23:59:59Z`),
        };
      } else {
        return res.status(400).json({ error: 'Invalid date format' });
      }
    }

    const pressReleases = await payload.find({
      collection: 'press-releases',
      where,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: '-datetime',
    });

    res.status(200).json(pressReleases);
  } catch (error) {
    console.error('Error fetching press releases:', error);
    res.status(500).json({ error: 'An error occurred while fetching press releases.' });
  }
};

  //not being used by frontend
  
  // export const createPressRelease = async (req, res) => {
  //   try {
  //     const {
  //       title,
  //       summary,
  //       content,
  //       title_ms,
  //       summary_ms,
  //       content_ms,
  //       datetime,
  //       attachments,
  //       relatedAgency //agencyId
  //     } = req.body;
  
  //     if (!title || !summary || !content || !title_ms || !summary_ms || !content_ms || !datetime || !relatedAgency) {
  //       return res.status(400).json({ error: 'Missing required fields' });
  //     } //validate
  
  //     const newPressRelease = await payload.create({
  //       collection: 'press-releases',
  //       data: {
  //         title,
  //         summary,
  //         content,
  //         title_ms,
  //         summary_ms,
  //         content_ms,
  //         datetime,
  //         attachments: attachments || [],  // attachmentens are optional
  //         relatedAgency
  //       }
  //     });
  
  //     res.status(201).json(newPressRelease);
  //   } catch (error) {
  //     console.error('Error creating press release:', error);
  //     res.status(500).json({ error: 'An error occurred while creating the press release.' });
  //   }
  // };