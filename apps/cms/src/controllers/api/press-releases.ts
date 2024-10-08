import payload from "payload";

export const list = async (req, res) => {
  try {
    const { page = 1, limit = 10, agency, mediaType, fromDate, toDate } = req.query;
    console.log("hello")
    let where = {
      status: {
        equals: "published",
      },
    };

    if (agency) {
      where["relatedAgency"] = {
        equals: agency, 
      };
    }

    if (mediaType && mediaType !== "All") {
      if (mediaType === "Media Release") {
        where["mediaType"] = {
          equals: "kenyataan_media", 
        };
      } else if (mediaType === "Speech Collection") {
        where["mediaType"] = {
          equals: "ucapan", 
        };
      }
    }

    if (fromDate) {
      const from = new Date(fromDate);
      if (!isNaN(from.getTime())) {
        where["datetime"] = { gte: from };
      } else {
        return res.status(400).json({ error: "Invalid fromDate format" });
      }
    }

    if (toDate) {
      const to = new Date(toDate);
      if (!isNaN(to.getTime())) {
        where["datetime"] = where["datetime"]
          ? { ...where["datetime"], lte: to }
          : { lte: to };
      } else {
        return res.status(400).json({ error: "Invalid toDate format" });
      }
    }

    const pressReleases = await payload.find({
      collection: "press-releases",
      where,
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: "-datetime",
    });

    res.status(200).json(pressReleases);
  } catch (error) {
    console.error("Error fetching press releases:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching press releases." });
  }
};

