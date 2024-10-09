import fs from 'fs/promises';
import path from 'path';


const add = async (file)=>{
      const rootPath =path.resolve(process.cwd(),".firstGit");
      const stagingPath=path.join(rootPath,'staging');

      try{
            await fs.mkdir(stagingPath,{recursive:true});
            const fileName=path.basename(file);
            await fs.copyFile(file,path.join(stagingPath,fileName));
            console.log(`file ${fileName} added to staging area!`);
      }catch(err){
        console.log('error while adding files :',err)
      }
}


export {add};