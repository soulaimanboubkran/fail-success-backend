import mongoose from 'mongoose';

const userStringListSchema = new mongoose.Schema(
  {
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference the User model
        required: true,
      },
    strings: {
      type: [String], // Array of strings
      default: [],
    }
  },
  { timestamps: true }
);

const UserStringList = mongoose.model('UserStringList', userStringListSchema);

export default UserStringList;
