
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';



const AllCategories = async (req, res) => {
    const { categoryId } = req.query;
    // Define __dirname
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    
    const dbPath = path.resolve(__dirname, '../db/dua_main.sqlite');
    console.log(dbPath)



    // Open the database
    const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the SQLite database.');
        }
    });

    // Query the database
    db.serialize(() => {



        let query = 'SELECT * FROM category';
        let params = [];
        
        if (categoryId) {
            query += ' WHERE cat_id = ?';
            params = [categoryId];
        }

        db.all(query, params, (err, rows) => {
            if (err) {
                console.error('Error reading from database:', err.message);
            } else {
                console.log('Category Data:', rows);
                res.status(201).send(rows)
            }
        });
    });

    // Close the database
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });

}

export default AllCategories



