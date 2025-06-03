import express from "express";
import {Pool} from "pg";
import cors from "cors";

const pool = new Pool({
    user: "postgres",
    database: "url",
    host: "localhost",
    password: "Jhala@27",
    port: 5432
})


const app = express();

app.use(express.json());
app.use(cors());

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function generateString(length) {
  let result = " ";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

app.post("/shorten", async (req,res)=>{
    const original = req.body.original;
    let flag =0;
    let counter=0;
    let shortened
    while(flag ==0 && counter<5)
    {
        shortened = generateString(8);
        let dbres1 = await pool.query("SELECT * FROM shortened_urls WHERE shortened = $1",[shortened])

        if(dbres1.rows !== undefined)
        {
            flag=1;
        }

        counter++;

    }


    let dbres2 = await pool.query(`INSERT INTO shortened_urls (original,shortened) values ($1, $2)`,[original,shortened]);

    let shortenedURL = "http://localhost:3000/"+shortened
    console.log(shortenedURL);

    res.status(200).json({"shortenedURL": shortenedURL})

})

app.get("/:seq" ,async (req,res)=>{

    let shortened = req.params.seq;
    let dbres3 = await pool.query("SELECT original FROM shortened_urls WHERE shortened = $1",[" "+shortened])
    console.log(dbres3);

    if(dbres3.rows[0]!=undefined)
    {
        res.redirect(dbres3.rows[0].original)
    }

    else{
        res.sendStatus(404);
    }
})

app.listen(3000,()=>{
    console.log("server listening")
})