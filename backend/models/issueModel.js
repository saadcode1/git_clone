import mongoose from "mongoose";
const { Schema } = mongoose;

const IssueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
  },
  { timestamps: true } // Corrected position for timestamps option
);

const Issue = mongoose.model("Issue", IssueSchema);

export default Issue;
