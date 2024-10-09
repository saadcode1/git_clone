import fs from 'fs/promises';
import path from 'path';
import {v4} from 'uuid';

const commit = async (message)=>{
      const rootPath=path.resolve(process.cwd(),".firstGit");
      const commitPath=path.join(rootPath,'commits');
      const stagingPath=path.join(rootPath,'staging');

      try{
           const commitId=v4();
           const commitDir=path.join(commitPath,commitId);
           await fs.mkdir(commitDir,{recursive:true});
           const files=await fs.readdir(stagingPath);
           for(const file of files){
           await fs.copyFile( 
           path.join(stagingPath,file),
           path.join(commitDir,file))
           }

           await fs.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify({ message, date: new Date().toISOString() })
          );
      
          console.log(`commit chnages done ${message} added files ${files}`);
      }catch(err){
        console.log("error while commits :",err)
      }
}

export {commit};