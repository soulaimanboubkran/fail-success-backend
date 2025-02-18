import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },isAdmin: {
        type: Boolean,
        default: false,
      },
    avatar:{
      type: String,
      default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    stringListRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserStringList', // Reference the UserStringList model
    },
  },
  { timestamps: true }
);
// Create indexes on the fields
userSchema.index({ username: 1 });
userSchema.index({ email: 1 });
const User = mongoose.model('User', userSchema);

export default User;