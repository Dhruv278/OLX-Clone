const mongoose=require('mongoose');

const connectDatabase=()=>{
        console.log(process.env.DB_LOCAL_URI)
        mongoose.connect(process.env.DB_LOCAL_URI).then(con=>{
            console.log('MongoDB Connected');
        })
}

module.exports=connectDatabase