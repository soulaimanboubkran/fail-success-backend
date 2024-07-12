import UserStringList from "../models/string.model.js";



export const getUserStringList = async (req, res, next) => {
    const userId = req.user.userId; // Assuming the authenticated user's ID is available in req.user
  
    try {
      // Find the UserStringList document for the user
      const userStringList = await UserStringList.findOne({ user: userId });
  
      if (!userStringList) {
        return next(errorHandler(404, 'UserStringList not found!'));
      }
  
      // Respond with the strings array
      res.status(200).json(userStringList.strings);
    } catch (error) {
      next(error);
    }
  };