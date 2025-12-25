import mongoose from "mongoose";

const searchLogSchema = new mongoose.Schema(
  {
    term: { type: String, required: true, unique: true },
    count: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model("SearchLog", searchLogSchema);
