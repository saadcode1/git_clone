import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import  jwt  from 'jsonwebtoken';
import  dotenv  from 'dotenv';
dotenv.config();


const signup =async(req,res)=>{
    const { username, password, email } = req.body;
    try{
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };

    const result = new User(newUser);
    await result.save();
    const token = jwt.sign(
      { id: result.insertId },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );
    console.log(result._id)
    res.json({ token, userId:result._id });
  } catch (err) {
    console.error("Error during signup : ", err.message);
    res.status(500).send("Server error");
  }
}


const login =async(req,res)=>{
    const {email,password}= req.body;

    try{
          const user= await User.findOne({email});

          if(!user){
            return res.status(400).json({ message: "User not found!" });
          }

         const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({ message: "User not found!" });  
        }

        const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{expiresIn:"1h"});
        res.json({token,userId:user._id});
    }catch(err){
        console.error("Error during login : ", err.message);
        res.status(500).send("Server error");
    }
}

const getAllUser =async(req,res)=>{
    try{
          const users=await User.find({});
          if(!users){
            res.status(404).json({message:"users are not found"})
          }

          res.json({users:users});
    }catch(err){
        console.error("Error during get users : ", err.message);
        res.status(500).send("Server error");
    }
}

const getUserProfile =async(req,res)=>{
    
    const userId=req.params.id;
    try{
           const user= await User.findById(userId).populate("repositories");
           if(!user){
           return res.status(404).json({message:"user not found!"});
           }

           res.json({user:user});
    }catch(err){
        console.error("Error during userProfile : ", err.message);
        res.status(500).send("Server error");
    }
}

const updateUserProfile =async(req,res)=>{
    const userId=req.params.id;
    const {email,password}=req.body;
    try{
           const fields={
           email:email
           }

           if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            fields.password = hashedPassword;
           }
           const result = await User.findOneAndUpdate({ _id: userId }, { $set: fields });
          if(!result){
            return res.json({message:"Did't update!"});
          }

          res.json({"update":result});
    }catch(err){
        console.error("Error during update user : ", err.message);
        res.status(500).send("Server error");
    }
}

const deleteUserProfile=async(req,res)=>{
        const userId=req.params.id;
        try{
           const user=await User.findByIdAndDelete(userId);
           if(!user){
            return res.status(404).json({"message":"user is not found"});
           }

           res.json({"deleted user":user});
        }catch(err){
            console.error("Error during delete user : ", err.message);
        res.status(500).send("Server error");
        }
}


export {
    signup,
    login,
    getAllUser,
    getUserProfile,
    deleteUserProfile,
    updateUserProfile
}
