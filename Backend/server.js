const app=require("./app");

const dotenv=require("dotenv");
const connectDatabase=require('./config/database');


process.on('uncaughtException',err=>{
    console.log(`ERROR:${err.stack}`);
    console.log('Shutting down due to uncught exception ');
    process.exit(1);
})

// Setting config file
dotenv.config({path:"Backend/config/config.env"});
connectDatabase();
const PORT=process.env.PORT ;
const server=app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

process.on('unhandledRejection',err=>{
    console.log(`Error:${err.message}`);
    console.log('Shutting down the server due to unhandled Promise rejection');
    server.close(()=>{
        process.exit(1);
    })
})