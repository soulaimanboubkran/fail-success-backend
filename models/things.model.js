import mongoose from 'mongoose';


const ThingSchema = new mongoose.Schema(
  {
    thing:{type:String,required:true},
    description:{type:String,required:false},
    type:{type:String,enum: ['private', 'public'],required:true,default:'private'},
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
ThingSchema.index({ userRef: 1 });
const Thing = mongoose.model('Real', ThingSchema);

export default Thing;