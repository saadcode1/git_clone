import mongoose from "mongoose";
const { Schema } = mongoose;

const RepositorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    content: [
      {
        type: String,
      },
    ],
    visibility: {
      type: Boolean,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
    files: [
      {
        filename: String,
        path: String,
        mimetype: String,
        size: Number
      }
    ],
  },
  { timestamps: true } // Corrected position for timestamps option
);

const Repository = mongoose.model("Repository", RepositorySchema);

export default Repository;
