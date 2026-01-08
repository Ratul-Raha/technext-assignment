import Url from "../models/Url.js";
import User from "../models/User.js";

// Helper to generate a unique 6-character short code
const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

// CREATE a short URL

export const createUrl = async (req, res) => {
  try {
    const { originalUrl } = req.body;
    const userId = req.user.id;

    if (!originalUrl) {
      return res.status(400).json({ message: "Original URL is required" });
    }

    try {
      new URL(originalUrl);
    } catch {
      return res.status(400).json({ message: "Invalid URL format" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    console.log("user created count:", user.createdUrlCount, "limit:", user.urlLimit);
    if (user.createdUrlCount >= user.urlLimit) {
      return res.status(403).json({
        message: `URL limit reached for your ${user.package} plan`,
      });
    }

    let shortCode = generateShortCode();
    let exists = await Url.findOne({ shortCode });
    while (exists) {
      shortCode = generateShortCode();
      exists = await Url.findOne({ shortCode });
    }

    const url = await Url.create({
      userId,
      originalUrl,
      shortCode,
    });

    user.createdUrlCount += 1;
    await user.save();

    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    res.status(201).json({
      message: "URL shortened successfully!", // <-- success message from backend
      data: {
        ...url.toObject(),
        shortUrl,
      },
    });
  } catch (error) {
    console.error("Create URL error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET all URLs for a user
export const getUrls = async (req, res) => {
  try {
    const userId = req.user.id;
    const urls = await Url.find({ userId }).sort({ createdAt: -1 });

    const formattedUrls = urls.map((url) => ({
      ...url.toObject(),
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
    }));

    res.json(formattedUrls);
  } catch (error) {
    console.error("Get URLs error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE a URL by ID
export const deleteUrl = async (req, res) => {
  try {
    const userId = req.user.id
    const { id } = req.params

    const url = await Url.findOne({ _id: id, userId })
    if (!url) {
      return res.status(404).json({ message: "URL not found" })
    }

    await url.deleteOne() // only delete the URL
    res.json({ message: "URL deleted successfully" })
  } catch (error) {
    console.error("Delete URL error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// REDIRECT short URL to original
export const redirectUrl = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code });
    if (!url) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Increment clicks
    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ----------------------------
// GET URL stats by ID
// ----------------------------
export const getUrlStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const url = await Url.findOne({ _id: id, userId });
    if (!url) {
      return res.status(404).json({ message: "URL not found" });
    }

    res.json({
      originalUrl: url.originalUrl,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      clicks: url.clicks,
      createdAt: url.createdAt,
    });
  } catch (error) {
    console.error("Get URL stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
