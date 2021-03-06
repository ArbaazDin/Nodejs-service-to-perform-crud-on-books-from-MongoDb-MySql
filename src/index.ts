import express from "express";
const app = express();
const port = 8080; // default port to listen
import mongo from 'mongodb';

const MongoClient = mongo.MongoClient;
const url = "mongodb://localhost:27017/";
const booksAppDb = "BooksApp";

import mysql from "mysql";
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'arbaaz',
    password: 'arbaaz',
    database: 'sys'
});


import bodyParser from 'body-parser';

import cors from 'cors';

app.use(cors());


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

// Fetch Books -------------------------------------------------------------------------------------------------------------------------------------------------------------
app.get("/getBooks", (req, res) => {

    // // Using MongoDb
    MongoClient.connect(url, async (error: any, db: any) => {
        const dbo = db.db(booksAppDb);
        const result = await dbo.collection("books").find().toArray();
        db.close();
        res.json({
            status: "SUCCESS",
            booksArray: result
        });
    });

    // // Using MySql
    // const sqlQuery = "SELECT * FROM sys.books";
    // connection.query(sqlQuery, (error: any, result, fields) => {
    //     if (error) throw error;
    //     res.json({ status: "SUCCESS", booksArray: result });
    // });

});

// Save Books -------------------------------------------------------------------------------------------------------------------------------------------------------------
// app.post("/saveBooks", async (req, res) => {
//     try {
//         const books = req.body.books;
//         const originalBooks = req.body.originalBooks;

//         // Check if the data on the client is same as data on the database
//         // This is to avoid concurrency issues
//         // // Using MongoDb
//         MongoClient.connect(url, async (error: any, db: any) => {
//             const dbo = db.db(booksAppDb);
//             const response = await dbo.collection("books").find().toArray();
//             if (response !== originalBooks) {
//                 res.json({
//                     status: "OLD_DATA_ON_CLIENT"
//                 });
//             }
//         });

//         const promiseArray: Promise<any>[] = [];
//         let result: any;

//         // Using MongoDb
//         MongoClient.connect(url, async (error: any, db: any) => {
//             books.forEach((book: any) => {

//                 book.id = book.id.toString();
//                 book.price = Number(book.price);

//                 if (book.type === 'deleted') {
//                     const dbo = db.db(booksAppDb);
//                     promiseArray.push(dbo.collection('books').deleteOne({ 'id': book.id }));
//                 } else if (book.type === 'new') {
//                     const dbo = db.db(booksAppDb);
//                     book.type = "saved";
//                     promiseArray.push(dbo.collection('books').insert(book));
//                 }
//             }); // End For Each
//             console.log("Inside ----------------", promiseArray);
//             console.log(await Promise.all(promiseArray));
//         });

//         // // Using MySql
//         // const sqlQuery = `UPDATE sys.books SET title=${book.title},author=${book.author},price=${book.price},type='saved' WHERE id=${book.id}`;
//         // connection.query(sqlQuery, (error: any, result, fields) => {
//         //     if (error) {
//         //         throw error;
//         //     }
//         // });

//         // if (book.type === "new") {
//         //     const sqlQuery = `INSERT INTO sys.books VALUES ('${book.id}','${book.title}','${book.author}',${book.price},'saved')`;
//         //     promiseArray.push(executeQuery(sqlQuery));
//         // } else if (book.type === "deleted") {
//         //     const sqlQuery = `DELETE from sys.books WHERE id='${book.id}'`;
//         //     promiseArray.push(executeQuery(sqlQuery));
//         // }




//         // // Using MongoDB
//         // result = await Promise.all(promiseArray);
//         console.log(result.length);
//         if (!result.empty) {
//             res.json({
//                 status: "FAIL"
//             })
//         } else {
//             res.json({
//                 status: "SUCCESS"
//             });
//         }

//         // // Using MySql
//         // const result: any = await Promise.all(promiseArray);
//         // console.log(result.length);
//         // if (result.length === 0) {
//         //     res.json({
//         //         status: "FAIL"
//         //     })
//         // } else {
//         //     res.json({
//         //         status: "SUCCESS"
//         //     });
//         // }

//     } catch (error) {
//         res.json({
//             status: "FAIL",
//             error: error.message
//         });
//     }
// });

function executeQuery(sqlQuery: string): Promise<any> {
    return new Promise((resolve, reject) => {
        connection.query(sqlQuery, (error: any, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}


// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});