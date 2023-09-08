const express =require('express');
//got our express-ejs-layout
const bodyParser = require("body-parser");
const cookieParser=require('cookie-parser');
//used for encypting session-cookienp
const session =require('express-session')
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy')
const MongoStore=require('connect-mongo')

//mongoStore is used to store session cookie in the db
const app= express();
const db=require('./config/mongoose');
//tell the app for reading and writing through the post request
app.use(
    bodyParser.urlencoded({
      extended: false,
    })
  );
  
//tell app to use cookieParser as a middleware when the request is comming in than cookie is need to be passed
app.use(cookieParser());



// //we need to tells app to look out for static file at the path mentioned in below line
// app.use(express.static('./assets'));

// //we need to tell our app to use expressLayouts library and describe it before router library since router library use to render views
// app.use(expressLayouts);
// //extract styles and script from sub pages inot layouts
// app.set('layout extractStyles',true)
// app.set('layout extractScripts',true)


const port=8000;




app.use(session({
    name: 'Placement_Cell',
    // TODO change the secret before deployment in production mode

    secret: 'anything',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },

    store: MongoStore.create({
        //options)
    // store : new MongoStore({
       mongoUrl : "mongodb+srv://manindra301998:Manindra%40304@cluster0.utmwdfy.mongodb.net/?retryWrites=true&w=majority",
        autoremove : "disabled",
    },function(err){
        console.log("error at mongo store",err || "connection established to store cookie");
    })
}))





app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser); 

//use express router-first rquest comes to app.js and then for any request which comes to app.js after the localhost:8000/ is mapped or  goes to below path i.e routers folder index.js  so this router can be used


app.use('/',require('./routers'));


//tells app which view engine are we using and set up the view engine
app.set('view engine','ejs');
app.set('views','./views');
app.listen(port,function(err){
    if(err){
       // console.log('Error',err);
        console.log(`Error in running the server : ${err}`)
    }

    console.log(`server is running on port : ${port} successfully!`)
})