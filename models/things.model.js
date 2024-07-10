import mongoose from 'mongoose';


const ThingSchema = new mongoose.Schema(
  {
    thing:{type:String,required:true},
    state:{type: String,
        enum: ['fail', 'success']},
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference the User model
      required: true
  }
  },
  { timestamps: true }
);

const Thing = mongoose.model('Real', ThingSchema);

export default Thing;