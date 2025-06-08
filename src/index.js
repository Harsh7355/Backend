import dotenv from 'dotenv';
import express from 'express'
import { app } from './app.js';
import path from "path";
import { DB_NAME } from './constants.js'
import connectdb from './db/database.js'

dotenv.config({ path: path.resolve("Public/temp/.env") });




connectdb().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Database is connected ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log("Database is not connected");
    
})