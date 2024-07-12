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

  export const setState = async (req, res, next) => {
    try {
      const { id } = req.params; // Assuming the thing ID is passed as a URL parameter
      const { state } = req.body;
  
      // Validate required fields
      if (!state) {
        return next(errorHandler(400, "Missing required fields"));
      }
  
      // Update the thing in the database
      const updatedThing = await Thing.findByIdAndUpdate(
        id,
        {  state },
        { new: true } // To return the updated document
      );
  
      // Check if the thing was found and updated
      if (!updatedThing) {
        return next(errorHandler(404, "Thing not found"));
      }
  
      return res.status(200).json({ updatedThing });
    } catch (error) {
      next(error);
    }
  };
  export const deleteThing = async (req, res, next) => {
    try {
      const { id } = req.params; // Assuming the thing ID is passed as a URL parameter
  
      // Delete the thing from the database
      const deletedThing = await Thing.findByIdAndDelete(id);
  
      // Check if the thing was found and deleted
      if (!deletedThing) {
        return next(errorHandler(404, "Thing not found"));
      }
  
      
  
      return res.status(200).json({ message: "Thing deleted successfully" });
    } catch (error) {
      next(error);
    }
  };
  