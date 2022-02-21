const mongoose=require("mongoose");

function connectDB(){
  mongoose.connect('MONGODB_URI', {useUnifiedTopology: true,useNewUrlParser: true});
  const connection=mongoose.connection;

   connection.on('connected',()=>{
       console.log('MongoDB connection successfull');
   })
   connection.on('error',()=>{
    console.log('MongoDB connection failed');
})
}

connectDB();
module.exports=mongoose;