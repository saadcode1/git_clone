import Repository from "../models/repository.js"
import mongoose from "mongoose";
import  User  from "../models/userModel.js";
const createRepo=async (req,res)=>{
    const file=req.file;
    console.log(file)
    const {name,description,content,visibility,owner,issues}=req.body;
    try{
        if (!name) {
            return res.status(400).json({ error: "Repository name is required!" });
          }
      
          if (!mongoose.Types.ObjectId.isValid(owner)) {
            return res.status(400).json({ error: "Invalid User ID!" });
          }
    console.log(file);
    const newRepository = new Repository({
        name,
        description,
        visibility,
        owner,
        content,
        issues,
        files:[{
            filename:file.filename,
            path:file.path,
            mimetype:file.mimetype,
            size:file.size
        }]
      });
      
      const result = await newRepository.save();

      const resultId=result._id;
      await User.findByIdAndUpdate(owner, { $push: { repositories: resultId } });
      res.status(201).json({
        message: "Repository created!",
        repositoryID: result._id,
      });
  
    }catch(err){
        console.error("Error during creating repo : ", err.message);
    res.status(500).send("Server error");
    }
}

const getAllRepo=async (req,res)=>{
   try{
         const allRepo= await Repository.find({}).populate("owner");

         res.json(allRepo);
   }catch(err){
    console.error("Error during getAll Repo! : ", err.message);
    res.status(500).send("Server error");
   }
}

const fetchRepoById=async (req,res)=>{
    const id=req.params.id;

    try{
         const fetchRepo= await Repository.findById(id).populate("owner");

         if(!fetchRepo){
            return res.json({message:"repo was not exist!"});
         }

         res.json(fetchRepo);

    }catch(err){
        console.error("Error during Fetch repo by Id : ", err.message);
        res.status(500).send("Server error");
    }
}

const fetchRepoByName=async (req,res)=>{
    const name=req.params.name;

    try{
        const  repoFetch=await Repository.find({name}).populate("owner");

        if(!repoFetch){
            return res.json({message:"repository was not Exists"});
        }

        res.json(repoFetch);
    }catch(err){
        console.error("Error during Fetch repo by name : ", err.message);
        res.status(500).send("Server error");
    }
}

const fetchRepositryCurrentUser = async (req, res) => {
    const { userID } = req.params;

    try {
      const repositories = await Repository.find({ owner: userID });
  
      if (!repositories || repositories.length == 0) {
        return res.status(404).json({ error: "User Repositories not found!" });
      }
      console.log(repositories);
      res.json({ message: "Repositories found!", repositories });

    } catch (err) {
      console.error("Error during fetching user repo : ", err.message);
      res.status(500).send("Server error");
    }
  }
  const updateRepoById = async (req, res) => {
    const { id } = req.params;
    const file = req.file;
    const { name, description, visibility, content } = req.body;
    console.log(file);
    try {
        // Find the repository first
        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({ error: "Repository not found!" });
        }

        // Update the repository fields
        if (name) repository.name = name;
        if (description) repository.description = description;
        if (visibility !== undefined) repository.visibility = visibility;
        if (content) repository.content = content;

        // Update file information if a new file is uploaded
        if (file) {
            repository.files = [{
                filename: file.filename,
                path: file.path,
                mimetype: file.mimetype,
                size: file.size
            }];
        }

        // Save the updated repository
        const updatedRepository = await repository.save();

        res.json({
            message: "Repository updated successfully!",
            repository: updatedRepository,
        });
    } catch (err) {
        console.error("Error during updating repository : ", err.message);
        res.status(500).send("Server error");
    }
}
const toggleVisibilityById=async (req,res)=>{
    const { id } = req.params;

    try {
      const repository = await Repository.findById(id);
      if (!repository) {
        return res.status(404).json({ error: "Repository not found!" });
      }
  
      repository.visibility = !repository.visibility;
  
      const updatedRepository = await repository.save();
  
      res.json({
        message: "Repository visibility toggled successfully!",
        repository: updatedRepository,
      });
    } catch (err) {
      console.error("Error during toggling visibility : ", err.message);
      res.status(500).send("Server error");
    }
}

const deleteRepoById=async (req,res)=>{
    const { id } = req.params;
    try {
      const repository = await Repository.findByIdAndDelete(id);
      if (!repository) {
        return res.status(404).json({ error: "Repository not found!" });
      }
  
      res.json({ message: "Repository deleted successfully!" });
    } catch (err) {
      console.error("Error during deleting repository : ", err.message);
      res.status(500).send("Server error");
    }
}


export {createRepo,getAllRepo,deleteRepoById,fetchRepoById,fetchRepoByName,fetchRepositryCurrentUser,toggleVisibilityById,updateRepoById,}


