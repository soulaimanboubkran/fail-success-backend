import User from '../models/users.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export const SignUp = async (req,res,next)=>{

    const {username,email,password,phoneNumber} = req.body;
    const hashedPassword = bcryptjs.hashSync(password,10);
    const newUser = new User({
        username,
        email,
        isAdmin:false,
        password:hashedPassword,
        phoneNumber
    });

    try {
        await newUser.save();

        res.status(201).json('User created successfully!');
    } catch (error) {
        next(error)
    }
}
export const SignIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find the user by email and populate the 'stringListRef' field with 'strings'
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));

    // Check if the password matches
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    // Generate JWT token
    const token = jwt.sign(
      { userId: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    // Prepare response data, omitting sensitive fields like 'password'
    const { password: pass, ...rest } = validUser._doc;
    const response = {
      ...rest,
      token
    };

    // Set JWT token in a cookie and send the response
    res.cookie("token", token, { httpOnly: true }).status(200).json(response);
  } catch (error) {
    // Pass any errors to the error handling middleware
    next(error);
  }
};


export const google = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {

        const token = jwt.sign( { userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = user._doc;
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(200)
          .json({rest,token});

      }
       else {
        const generatedPassword =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

        const newUser = new User({
          username:
            req.body.name.split(' ').join('').toLowerCase() +
            Math.random().toString(36).slice(-4),
          email: req.body.email,
          isAdmin: false,
          password: hashedPassword,
          avatar: req.body.photo,
        });

        await newUser.save();

        const token = jwt.sign( { userId: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
        const { password: pass, ...rest } = newUser._doc;
        res
          .cookie('token', token, { httpOnly: true })
          .status(200)
          .json({rest,token});
      }
    } catch (error) {
      next(error);
    }
  };


  

//--------------------------------------------------------------------------------------------------------
//irgv uxtg sijs carm
export const forgotPass = async (req, res, next) => {
    const { email } = req.body;
    try {
      const oldUser = await User.findOne({ email });
      if (!oldUser) return res.status(404).json('not found');
        
      
      const secret = process.env.JWT_SECRET + oldUser.password;
      const token = jwt.sign(
        { email: oldUser.email, id: oldUser._id },
        secret,
        {
          expiresIn: '10m',
        }
      );
     
      const linkR = `http://localhost:5173/forgot-pass/${oldUser._id}/${token}`;
      try {
          const mailOptions = {
            from: 'hightllevel@gmail.com',
            to: email,
            subject: 'Reset Password',
            text: linkR,
          };
    
          await transporter.sendMail(mailOptions);
         
          res.json({ success: true, message: 'Email sent successfully' });
        } catch (error) {
          
          console.log(error)
        }
     
    
  
    } catch (error) {
      next(error);
    }
  }

  export const resetPass = async (req, res, next) => {
  
      const { id, token } = req.params;
  
      const oldUser = await User.findOne({ _id: id });
      if (!oldUser) return res.status(404).json('not found');
          
      
      const secret = process.env.JWT_SECRET + oldUser.password;
      try {
        const verify = jwt.verify(token, secret);
        
      } catch (error) {
        next(error)
        res.send("Not Verified");
      }
    
    }
    export const ResetPass =async  (req,res)=>{
      const { id, token } = req.params;
    const  password  = req.body.password;
  
    try {
      if (!password) {
        return res.json({ success: false, statusCode: 400, message: "Password is required" });
      }
  
      const oldUser = await User.findOne({ _id: id });
  
      if (!oldUser) {
        return res.json({ success: false, statusCode: 404, message: "User Not Exists!!" });
      }
  
      const secret = process.env.JWT_SECRET + oldUser.password;
  
      const verify = jwt.verify(token, secret);
  
      const encryptedPassword = bcrypt.hashSync(password, 10);
  
      await User.updateOne(
        {
          _id: id,
        },
        {
          $set: {
            password: encryptedPassword,
          },
        }
      );
  
      res.json({ success: true, message: 'password has changed' });
    } catch (error) {
    
      
      res.json({ success: false, statusCode: 500, message: error.message });
    }
    }
  