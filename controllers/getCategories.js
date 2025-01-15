
// import sqlite3 from 'sqlite3';
// import path from 'path';
// import { fileURLToPath } from 'url';



// const Categories = async (req, res) => {
//     const { categoryId } = req.query;
//     // Define __dirname
//     const __filename = fileURLToPath(import.meta.url);
//     const __dirname = path.dirname(__filename);

    
//     const dbPath = path.resolve(__dirname, '../db/dua_main.sqlite');
//     console.log(dbPath)



//     // Open the database
//     const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
//         if (err) {
//             console.error('Error opening database:', err.message);
//         } else {
//             console.log('Connected to the SQLite database.');
//         }
//     });

//     // Query the database
//     db.serialize(() => {



//         let query = 'SELECT * FROM dua';
//         let params = [];
        
//         if (categoryId) {
//             query += ' WHERE cat_id = ?';
//             params = [categoryId];
//         }

//         db.all(query, params, (err, rows) => {
//             if (err) {
//                 console.error('Error reading from database:', err.message);
//             } else {
//                 console.log('Category Data:', rows);
//                 res.status(201).send(rows)
//             }
//         });
//     });

//     // Close the database
//     db.close((err) => {
//         if (err) {
//             console.error('Error closing database:', err.message);
//         } else {
//             console.log('Database connection closed.');
//         }
//     });

// }

// export default Categories





















import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const Categories = async (req, res) => {
    const { categoryId } = req.query;  // Query parameter for categoryId

    // Define __dirname
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Correct path to the SQLite database
    const dbPath = path.resolve(__dirname, '../db/dua_main.sqlite');
    console.log(dbPath);

    try {
        // Open the database connection
        const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                return res.status(500).json({ error: 'Database connection failed' });
            } else {
                console.log('Connected to the SQLite database.');
            }
        });

        // Query categories
        const categoryQuery = 'SELECT * FROM category';
        let categories = await new Promise((resolve, reject) => {
            db.all(categoryQuery, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });

        // If categoryId is provided, filter categories
        if (categoryId) {
            categories = categories.filter(category => category.cat_id === parseInt(categoryId));
        }

        // For each category, get related sub-categories and duas
        for (const category of categories) {
            const subCategoryQuery = 'SELECT * FROM sub_category WHERE cat_id = ?';
            const subCategories = await new Promise((resolve, reject) => {
                db.all(subCategoryQuery, [category.cat_id], (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                });
            });

            // For each sub-category, get related duas
            for (const subCategory of subCategories) {
                const duaQuery = 'SELECT * FROM dua WHERE subcat_id = ?';
                const duas = await new Promise((resolve, reject) => {
                    db.all(duaQuery, [subCategory.id], (err, rows) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(rows);
                        }
                    });
                });

                // Attach the duas to the sub-category
                subCategory.duas = duas;
            }

            // Attach the sub-categories to the category
            category.subCategories = subCategories;
        }

        // Return the structured data (categories with sub-categories and duas)
        res.status(200).json(categories);

        // Close the database connection
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export default Categories;
