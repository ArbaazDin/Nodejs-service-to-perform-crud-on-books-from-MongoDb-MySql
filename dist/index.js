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
    connection.query(sqlQuery, (error, result, fields) => {
        if (error)
            throw error;
        res.json({ status: "SUCCESS", booksArray: result });
    });
});
app.post("/saveBooks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const books = req.body;
    const promiseArray = [];
    books.forEach((book) => {
        MongoClient.connect(url, (error, db) => __awaiter(void 0, void 0, void 0, function* () {
            if (book.type === 'deleted') {
                const dbo = db.db(booksAppDb);
                promiseArray.push(yield dbo.collection('books').remove({ 'id': book.id }));
            }
            else if (book.type === 'new') {
                const dbo = db.db(booksAppDb);
                book.type = "saved";
                promiseArray.push(yield dbo.collection('books').insert(book));
            }
        }));
    });
    const result = yield Promise.all(promiseArray);
    console.log(result);
    if (result.empty()) {
        res.json({
            status: "SUCCESS"
        });
    }
    else {
        res.json({
            status: "FAIL"
        });
    }
}));
// start the Express server
app.listen(port, () => {
    // tslint:disable-next-line:no-console
    console.log(`server started at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map