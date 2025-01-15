import express from 'express'
import router from './router/router.js';
import cors from 'cors'

const app = express()

const port = process.env.PORT || 4000;

app.use(cors());


// Middleware to parse JSON 
app.use(express.json());

app.use('/api', router)


app.listen(PORT, ()=>{
    console.log(`server connected to port ${port}`)
})