import payload from 'payload';

export const getPressReleases = async (req, res) => {
    try {
      const { page = 1, limit= 10 } = req.query;
  
      const pressReleases = await payload.find({
        collection: 'press-releases',
        where: {
            status: {
              equals: 'published',
            },
          },
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
      const { agencyId, page = 1, limit = 10 } = req.query;
  
      if (!agencyId) {
        return res.status(400).json({ error: 'Agency ID is required' });
      }
  
      const pressReleases = await payload.find({
        collection: 'press-releases',
        where: {
          relatedAgency: {
            equals: agencyId,
          },
          status: {
            equals: 'published',
          },
        },
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

  export const createPressRelease = async (req, res) => {
    try {
      const {
        title,
        summary,
        content,
        title_ms,
        summary_ms,
        content_ms,
        datetime,
        attachments,
        relatedAgency //agencyId
      } = req.body;
  
      if (!title || !summary || !content || !title_ms || !summary_ms || !content_ms || !datetime || !relatedAgency) {
        return res.status(400).json({ error: 'Missing required fields' });
      } //validate
  
      const newPressRelease = await payload.create({
        collection: 'press-releases',
        data: {
          title,
          summary,
          content,
          title_ms,
          summary_ms,
          content_ms,
          datetime,
          attachments: attachments || [],  // attachmentens are optional
          relatedAgency
        }
      });
  
      res.status(201).json(newPressRelease);
    } catch (error) {
      console.error('Error creating press release:', error);
      res.status(500).json({ error: 'An error occurred while creating the press release.' });
    }
  };