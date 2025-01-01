import express from  "express"
import bodyParser from "body-parser"

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res)=>{
    res.send("Hello Chat ups")
})

app.listen(3000, ()=>{
    console.log("Server is up on 3000")
})