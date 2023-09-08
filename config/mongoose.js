const mongoose=require('mongoose');

//establish connection to mongo database running in the background on my system
//mongoose.connect('mongodb://localhost/Placementcell_development');
mongoose.connect('mongodb+srv://manindra301998:Manindra%40304@cluster0.utmwdfy.mongodb.net/?retryWrites=true&w=majority')

//below 3 lines are to make sure connection was established successfully or not
const db=mongoose.connection;
//if there is error in connecting to db
db.on('error',console.error.bind(console,"error connecting to MongoDB"));
//when we get connected to databse and connection is open
db.once('open',function(){
    console.log('connected to database successfully: mongoDb')
})

//to make this module usable we need to export it
module.exports=db;

