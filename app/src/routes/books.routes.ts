import { BooksController } from './../controllers/books.controller';
import { Application, Request, Response } from 'express';


export class BookRoutes{

    public init(app:Application){
    const bookController:BooksController = new BooksController();

        app.get('/books', async (req:Request, res:Response) => {
            try {
                const books = await bookController.getAllBooks();
                res.json(books);
            } catch (error) {
                res.status(500).json({ error: 'Failed to fetch books' });
            }
        });
        
        app.post('/add-book', async (req:Request, res:Response) => {
            const { title, author_id } = req.body;
            try {
                const book = await bookController.createBook(title, parseInt(author_id));
                res.status(201).json(book);
            } catch (error) {
                res.status(500).json({ error: 'Failed to create book' });
            }
        });
        
        app.post('/book-:id', async (req:Request, res:Response) => {
            const { id } = req.params;
            const { title, authorId } = req.body;
            try {
                const book = await bookController.updateBook(parseInt(id), title, parseInt(authorId));
                res.json(book);
            } catch (error) {
                res.status(500).json({ error: 'Failed to update book' });
            }
        });
        
        app.delete('/book-:id', async (req:Request, res:Response) => {
            const { id } = req.params;
            try {
                const book = await bookController.deleteBook(parseInt(id));
                res.json(book);
            } catch (error) {
                res.status(500).json({ error: 'Failed to delete book' });
            }
        });
    }
}
