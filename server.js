const  express = require('express');
//initialize express
const app = express();

const cors = require('cors');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');

//configure cors
app.use(cors());

//configure express to receive data from client
app.use(express.json());

//configure dotEnv
dotEnv.config({path : './.env'});


const port = process.env.PORT || 5000;

//mongoose configuration
mongoose.connect(process.env.MONGO_DB_CLOUD_URL , {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:false,
    useCreateIndex:true
}).then((response)=>{
    console.log('Connected to MongoDB Cloud successfully.......')
}).catch((error)=>{
    console.error(error);
    process.exit(1);//stop the process if unable to connect mongodb
});


//simple request/url

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname , 'client' , 'build')));
    app.get('/', (request,response) => {
        response.sendFile(path.join(__dirname , 'client' , 'build' , 'index.html'));
    });
}

app.listen(port , ()=>{
    console.log(`Express Server is  started at PORT : ${port}`);
});


//router configuration

app.use('/api/users' , require('./router/userRouter'));
app.use('/api/posts' , require('./router/postRouter'));
app.use('/api/profiles' , require('./router/profileRouter'));