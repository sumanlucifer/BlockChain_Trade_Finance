require('express-async-errors'); //Used to by pass try catch block when we use asysc function.
const express = require('express');
const mongoose = require('mongoose')
const error = require('./middleWare/error');
const corsFilter = require('./middleWare/corsFilters'); // corsFilter is used to allow cross origin requests
const lc = require('./routes/lc');
const lcHistory = require('./routes/lcHistory');
// const config = require('./config/config');
const routesBC = require('./routes/routesBC');
const config = require('./config/config').getProps()




const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(corsFilter);



app.get('/', (req, res) => {
  res.send('welcome to Trade Finance');
})

//Router's
app.use('/api/lc', lc);
app.use('/api/lcHistory', lcHistory);
app.use('/api', routesBC);

app.use(error);
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason);
});
mongoose.connect(config.mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then((result) => {
  console.log("Successfully Connected to MongoDB")
}).catch(err => {
  console.log("Error in connecting mongodb ", err)
});

app.listen(PORT, () => console.log(`server started at port ${PORT}`));