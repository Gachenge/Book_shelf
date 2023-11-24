import express from "express";
import type { Request, Response } from "express";
import { body, validationResult } from "express-validator";

import * as BookService from "./book.service";

export const bookRouter = express.Router();

//Get a list of all the books
bookRouter.get("/", async(req: Request, resp:Response) => {
    try {
        const books = await BookService.listBooks()
        return resp.status(200).json(books)
    } catch (error: any) {
        return resp.status(500).json(error.message);
    }
})

//get a book by id
bookRouter.get("/:id",async (req: Request, resp: Response) => {
    const id: number =parseInt(req.params.id, 10)
    try{
        const book = await BookService.getBook(id)
        return resp.status(200).json(book)
    } catch (error: any) {
        return resp.status(500).json(error.message);
    }
})

//update book by id
bookRouter.put("/:id", body("title").isString(), body("authorId").isInt(),
    body("isFiction").isBoolean(), body("datePublished").isDate(), async(req:Request, resp:Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array()});
    }
    const id: number = parseInt(req.params.id, 10)
    try{
        const book = req.body
        const updatedBook = await BookService.updateBook(book, id)
        return resp.status(200).json(updatedBook)
    } catch(error: any) {
        return resp.status(500).json(error.message)
    }
})

//create a book
bookRouter.post("/", body("title").isString(), body("authorId").isString(),
body("isFiction").isString(), body("datePublished").isDate(), async(req:Request, resp:Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return resp.status(400).json({ errors: errors.array()});
    }
    try {
        const book = req.body
        const newBook = await BookService.createBook(book)
        return resp.status(200).json(newBook)
    } catch(error: any) {
        return resp.status(500).json(error.message)
    }
})

//delete a book
bookRouter.delete("/:id",async (req: Request, resp: Response) => {
    const id: number = parseInt(req.params.id, 10)
    try{
        await BookService.deleteBook(id)
        resp.json(204).json("Book deleted successfully")
    } catch (error: any){
        return resp.status(500).json(error.message)
    }
})
