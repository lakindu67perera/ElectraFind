const express = require('express')

const studentRoutes = require('./src/students/routes');
const app = express()
const port = 3001


//middle ware
app.use(express.json());

//routes

app.get('/',(req,res)=>{
    res.send('hello node api')
})
// app.get('/blog',(req,res)=>{
//     res.send('hello blog im lakindu')
// })

app.use('/api/v1/students', studentRoutes);

app.listen(port, ()=>{
    console.log(`node api app is running on port ${port}`)
});