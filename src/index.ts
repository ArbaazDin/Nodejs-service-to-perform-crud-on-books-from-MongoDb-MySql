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

// app.options('*', cors());

// define a route handler for the default home page

// MongoClient.connect(url, async (error: any, db: any) => {
//     const dbo = db.db(booksAppDb);
//     // const myobj = {
//     //     "id": 75645,
//     //     "title": "A1",
//     //     "author": "AAA",
//     //     "price": 123
//     // };
//     // dbo.collection("books").insertOne(myobj, (error:any, response:any) => {
//     //     if (error) throw error;
//     //     console.log("1 document inserted");
//     //     db.close();
//     // });
//         const result = await dbo.collection("books").find().toArray();

// });

// app.get("/getBooks", (req, res) => {
//     res.json({
//         status: "SUCCESS",
//         booksArray: [
//             {
//                 id: 75645,
//                 title: "A1",
//                 author: "AAA",
//                 price: 123
//             },
//             {
//                 id: 12435,
//                 title: "B1",
//                 author: "BBB",
//                 price: 456
//             },
//             {
//                 id: 46578,
//                 title: "C1",
//                 author: "CCC",
//                 price: 789
//             },
//         ]
//     });
// });


app.get("/getBooks", (req, res) => {

    // // Using MongoDb
    // MongoClient.connect(url, async (error: any, db: any) => {
    //     const dbo = db.db(booksAppDb);
    //     const result = await dbo.collection("books").find().toArray();
    //     db.close();
    //     res.json({
    //         status: "SUCCESS",
    //         booksArray: result
    //     });
    // });

    // // Using MySql

    const sqlQuery = "SELECT * FROM sys.books";
    connection.query(sqlQuery, (error: any, result, fields) => {
        if (error) throw error;
        res.json({ status: "SUCCESS", booksArray: result });
    });

});

app.post("/saveBooks", async (req, res) => {
    const books = req.body;
    const promiseArray: any = [];
    books.forEach((book: any) => {
        MongoClient.connect(url, async (error: any, db: any) => {
            if (book.type === 'deleted') {
                const dbo = db.db(booksAppDb);
                promiseArray.push(await dbo.collection('books').remove({ 'id': book.id }));
            } else if (book.type === 'new') {
                const dbo = db.db(booksAppDb);
                book.type = "saved";
                promiseArray.push(await dbo.collection('books').insert(book));
            }
        });
    });
    const result: any = await Promise.all(promiseArray);
    console.log(result);
    if (result.empty()) {
        res.json({
            status: "SUCCESS"
        });
    } else {
        res.json({
            status: "FAIL"
        })
    }
});

// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});