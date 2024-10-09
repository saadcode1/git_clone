import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';
import Repository from '../models/repository.js';

const push = async (file,userid)=>{
      const rootPath =path.resolve(process.cwd(),".firstGit");
      const commitPath=path.join(rootPath,'commits');
      const stagingPath=path.join(rootPath,'staging');
      const frontendPath=path.resolve(process.cwd(),"../frontend/frontend/uploads/");
      

try {
     
  

    await mongoose.connect(process.env.MONGODB_URI, {});

  // Check if the file exists in the staging area
  const filePath = path.join(stagingPath, file);


  // Generate a unique filename for the uploaded file
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  const newFileName = file + '-' + uniqueSuffix + path.extname(file);
  
  // Define the path where the file will be stored in the frontend
  const frontendFilePath = path.join(frontendPath, newFileName);
  // Move the file to the frontend uploads directory
  await fs.copyFile(filePath, frontendFilePath);
   console.log(frontendFilePath,"-----");
  // Create a new repository document or update an existing one
  const repository = await Repository.insertMany({
    name: file, // Add this line to provide a name for the repository
    owner: userid,
    visibility: true,
    files: [{
      filename: newFileName,
      path: frontendFilePath,
    }],
    description: "Initial commit",
  });
 
  console.log(`File ${file} pushed successfully for user ${userid}`);
  
  


  // Remove the file from the staging area
  await fs.unlink(filePath);

} catch (error) {
  console.error('Error pushing file:', error);
  throw error;
}


}


export {push};

