const mongoose = require("mongoose");

const projectSchema = mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    user_projects: {
        type: Array,
        required: true,
        default: []
    },
    
  }
);

module.exports = mongoose.model("Projects", projectSchema);