"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const port = 8080; // default port to listen
const mongodb_1 = __importDefault(require("mongodb"));
const MongoClient = mongodb_1.default.MongoClient;
const url = "mongodb://localhost:27017/";
const booksAppDb = "BooksApp";
const mysql_1 = __importDefault(require("mysql"));
const connection = mysql_1.default.createConnection({
    host: 'localhost',
    user: 'arbaaz',
    password: 'arbaaz',
    database: 'sys'
});
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
app.use(cors_1.default());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({
    extended: true
}));
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
    connection.query(sqlQuery, (error, result, fields) => {
        if (error)
            throw error;
        res.json({ status: "SUCCESS", booksArray: result });
    });
});
app.post("/saveBooks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const books = req.body;
        const promiseArray = [];
        books.forEach((book) => __awaiter(void 0, void 0, void 0, function* () {
            book.id = book.id.toString();
            book.price = Number(book.price);
            console.log(book);
            // // Using MongoDb
            // MongoClient.connect(url, async (error: any, db: any) => {
            //     if (book.type === 'deleted') {
            //         const dbo = db.db(booksAppDb);
            //         promiseArray.push(await dbo.collection('books').remove({ 'id': book.id }));
            //     } else if (book.type === 'new') {
            //         const dbo = db.db(booksAppDb);
            //         book.type = "saved";
            //         promiseArray.push(await dbo.collection('books').insert(book));
            //     }
            // });
            // // Using MySql
            // const sqlQuery = `UPDATE sys.books SET title=${book.title},author=${book.author},price=${book.price},type='saved' WHERE id=${book.id}`;
            // connection.query(sqlQuery, (error: any, result, fields) => {
            //     if (error) {
            //         throw error;
            //     }
            // });
            if (book.type === "new") {
                const sqlQuery = `INSERT INTO sys.books VALUES ('${book.id}','${book.author}',${book.price},'saved')`;
                promiseArray.push(executeQuery(sqlQuery));
            }
            else if (book.type === "deleted") {
                const sqlQuery = `DELETE from sys.books WHERE id='${book.id}'`;
                promiseArray.push(executeQuery(sqlQuery));
            }
        })); // End For Each
        const result = yield Promise.all(promiseArray);
        console.log(result.length);
        if (result.length === 0) {
            res.json({
                status: "FAIL"
            });
        }
        else {
            res.json({
                status: "SUCCESS"
            });
        }
    }
    catch (error) {
        res.json({
            status: "FAIL",
            error: error.message
        });
    }
}));
function executeQuery(sqlQuery) {
    return new Promise((resolve, reject) => {
        connection.query(sqlQuery, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
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
//# sourceMappingURL=index.js.map