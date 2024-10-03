import payload from "payload";

export const agencyList = async (req, res) => {
    try {
      const agencies = await payload.find({
        collection: 'agencies',
        where: {}, 
        limit: 20, 
      });
  
      res.status(200).json(agencies);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      res
        .status(500)
        .json({ error: 'An error occurred while fetching agencies.' });
    }
  };