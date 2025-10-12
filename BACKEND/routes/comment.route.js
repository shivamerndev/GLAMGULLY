import express from 'express'
import { addComment } from '../controllers/comment.controller.js';

const Router = express.Router()
Router.post("/create", addComment)
export default Router;