import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as AuthorService from "./author.service";

export const authorRouter = express.Router();

// get a list of all authors
authorRouter.get("/",async (request:Request, response: Response) => {
    try{
        const authors = await AuthorService.listAuthors();
        return response.status(200).json(authors);
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

// get author by id
authorRouter.get("/:id",async (request:Request, response: Response) => {
    const id: number =parseInt(request.params.id, 10);
    try{
        const author = await AuthorService.getAuthor(id)
        if (author){
            return response.status(200).json(author)
        }
        return response.status(404).json("Author could not be found")
    } catch (error: any) {
        return response.status(500).json(error.message);
    }
})

// post: create a new author
//params: firstname, lastname
authorRouter.post("/", body("firstName").isString(), body("lastName").isString(), async(req:Request, resp:Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array()});
    }
    try{
        const author = req.body
        const newAuthor = await AuthorService.createAuthor(author)
        return resp.status(200).json(newAuthor)
    } catch (error: any) {
        return resp.status(500).json(error.message);
    }
})

//update author
authorRouter.put("/:id", body("firstName").isString(), body("lastName").isString(), async(req:Request, resp:Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array()});
    }
    const id: number = parseInt(req.params.id, 10)
    try {
        const author = req.body
        const updatedAuthor = await AuthorService.updateAuthor(author, id)
        return resp.status(200).json(updatedAuthor)
    } catch (error: any) {
        return resp.status(500).json(error.message);
    }
})

//delete author by id
authorRouter.delete("/:id",async (req:Request, resp: Response) => {
    const id: number = parseInt(req.params.id, 10)
    try{
        await AuthorService.deleteAuthor(id)
        return resp.status(204).json("Author has been succesfully deleted")
    } catch (error: any) {
        return resp.status(500).json(error.message);
    }
})
