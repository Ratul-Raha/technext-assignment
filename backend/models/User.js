import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    package: {
      type: String,
      enum: ["Free", "Pro", "Premium"], // add more packages if needed
      default: "Free",
    },
    urlLimit: {
      type: Number,
      default: 100, // Free users can create up to 100 URLs
    },
    createdUrlCount: {
      type: Number,
      default: 0, // Tracks how many URLs the user has created
    },
  },
  { timestamps: true }
)

const User = mongoose.models.User || mongoose.model("User", userSchema)
export default User
