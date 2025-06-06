import dotenv from 'dotenv';
import express from 'express'
import { DB_NAME } from './constants.js'
import connectdb from './db/database.js'

dotenv.config({ path: './env' });




connectdb()