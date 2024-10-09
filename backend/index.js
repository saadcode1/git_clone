import { hideBin } from 'yargs/helpers';
import yargs from 'yargs';
import { add } from './controllers/add.js';
import {init} from './controllers/init.js';
import {commit} from './controllers/commit.js';
import { revert } from './controllers/revert.js';
import {push} from './controllers/push.js';
import path from 'path';
import multer from 'multer';
yargs(hideBin(process.argv))
.command('start', 'to start server!', {}, start)
  .command('init', 'Initialization Done!', {}, init)
  .command('add <file>', 'adding files',(yargs)=>{
   yargs.positional('file',{
    describe:"file adding",
    type:"String",
   })
  },(argv)=>{
     add(argv.file);
  })
  .command('commit <message>', 'commit chnages',(yargs)=>{
    yargs.positional('message',{
     describe:"commit changes",
     type:"String",
    })
   },(argv)=>{
      commit(argv.message);
   })
   .command('revert <commitId>', 'revert files', (yargs) => {
      yargs.positional('commitId', {
        describe: 'revert changes',
        type: 'String',
      });
    }, (argv) => {
      revert(argv.commitId);
    })
    .command('push <file> <userid>', 'push files', (yargs) => {
      yargs.positional('file', {
        describe: "file to push",
        type: "string"
      })
      yargs.positional('userid', {
        describe: "user ID",
        type: "string"
      })
    }, (argv) => {
      push(argv.file, argv.userid);
    })
  .demandCommand(1, 'at least one command type')
  .help()
  .argv;

  import express from 'express';
  import bodyParser from 'body-parser';
  import cors from 'cors';
  import mongoose from 'mongoose';
  import { createServer } from "http";
  import  dotenv  from 'dotenv';

  import { socketconnection } from './soccket.js';
  import { userRouter } from './routes/userRoute.js';
  import repoRouter from './routes/repoRoute.js';
   
  dotenv.config();




  function start(){
    const app=express();
    const Port=process.env.PORT || 8000;
    


    const server=createServer(app);

    socketconnection(server);
     
    app.use(cors({
      origin:"*",
      methods:['GET','POST'],
      credentials:true
    }));

    app.use(bodyParser.json());
    app.use(express.json());
    const mongoURI ='mongodb+srv://mdshaadnizami:VRl3ltdDq8yNcAUR@gitclone.7gb8b.mongodb.net/git_clone?retryWrites=true&w=majority&appName=GITCLONE';
    

    // Configure local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../frontend/frontend/uploads/') 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))

    console.log(file,"from callbacke funtion")
  }
})
  
  const upload = multer({ storage });
  

    app.use("/",userRouter);
    app.use("/",upload.single('file'),repoRouter);
    
  
    mongoose
    .connect(mongoURI)
    .then(() => console.log("MongoDB connected!"))
    .catch((err) => console.error("Unable to connect : ", err));


    server.listen(Port,()=>{
      console.log(`server is running on port : ${Port}`);
    })
  }