import User from "../models/User.js";

// GET PROFILE

export const getProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const remainingUrls = user.urlLimit - user.createdUrlCount;
    const createdUrls = user.createdUrlCount;

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      package: user.package, 
      remainingUrls,
      createdUrls,
    });
  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//UPDATE PROFILE

export const updateProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const { name, email } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
