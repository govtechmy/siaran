import payload from "payload";

export const list = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      agency,
      mediaType,
      fromDate,
      toDate,
    } = req.query;
    let where = {};

    if (agency) {
      where["relatedAgency"] = {
        equals: agency,
      };
    }

    if (mediaType && mediaType !== "All") {
      if (mediaType === "Media Release") {
        where["type"] = {
          equals: "kenyataan_media",
        };
      } else if (mediaType === "Speech Collection") {
        where["type"] = {
          equals: "ucapan",
        };
      }
    }

    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);

      if (!isNaN(from.getTime())) {
        where["date_published"] = { greater_than_equal: from.toISOString() };
      } else {
        return res.status(400).json({ error: "Invalid fromDate format" });
      }
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);

      if (!isNaN(to.getTime())) {
        where["date_published"] = where["date_published"]
          ? {
              ...where["date_published"],
              less_than_equal: to.toISOString(),
            }
          : { less_than_equal: to.toISOString() };
      } else {
        return res.status(400).json({ error: "Invalid toDate format" });
      }
    }


    const pressReleases = await payload.find({
      collection: "press-releases",
      where,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: "-date_published",
    });

    res.status(200).json(pressReleases);
  } catch (error) {
    console.error("Error fetching press releases:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching press releases." });
  }
};

export const insertManyPressReleases = async (req, res) => {
  try {
    const { data } = req.body;

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        error: 'Invalid data format. "data" should be a non-empty array.',
      });
    }

    const transactionID = await payload.db.beginTransaction();

    const transactionalReq = {
      ...req,
      transactionID,
    };

    try {
      for (const pressRelease of data) {
        await payload.create({
          collection: 'press-releases',
          data: pressRelease,
          req: transactionalReq,
        });
      }

      if (transactionID) {
        await payload.db.commitTransaction(transactionID);
      }

      return res.status(201).json({
        message: 'All press releases inserted successfully.',
      });
    } catch (insertionError) {
      if (transactionID) {
        await payload.db.rollbackTransaction(transactionID);
      }

      console.error('Error inserting press releases:', insertionError);

      return res.status(500).json({
        error: 'An error occurred while inserting press releases.',
        details: insertionError.message,
      });
    }
  } catch (error) {
    console.error('Error in insertManyPressReleases:', error);

    return res.status(500).json({
      error: 'An unexpected error occurred.',
      details: error.message,
    });
  }
};