import UserStringList from "../models/string.model.js";
import Thing from "../models/things.model.js";
import { errorHandler } from "../utils/error.js";




export const createThing = async (req, res, next) => {
    try {
      const userId = req.user.userId; // Assuming the authenticated user's ID is available in req.user
      console.log(userId)
      const { thing,description,type, state } = req.body;
  
      if (!thing) {
        return next(errorHandler(400, "Missing required fields"));
      }
  
      const thingData = {
        thing,
        state,
        description,
        type,
        userRef: userId // Set the userRef field to the authenticated user's ID
      };
  
      // Create the new Thing document
      const newThing = await Thing.create(thingData);
  
      // Find the UserStringList document for the user or create a new one if it doesn't exist
      const userStringList = await UserStringList.findOneAndUpdate(
        { user: userId },
        { $push: { strings: thing } },
        { new: true, upsert: true }
      );
  
      return res.status(201).json({ newThing, userStringList });
    } catch (error) {
      next(error);
    }
  };

  export const getThings = async (req, res, next) => {
    try {
      const userId = req.user.userId; // Assuming the authenticated user's ID is available in req.user
  
      // Fetch all Thing documents related to the user
      const things = await Thing.find({ userRef: userId });
  
      // Check if any things were found
      if (!things.length) {
        return next(errorHandler(404, "No things found for this user"));
      }
  
      return res.status(200).json({ things });
    } catch (error) {
      next(error);
    }
  };