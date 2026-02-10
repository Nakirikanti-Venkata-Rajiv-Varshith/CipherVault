import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

const openai = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // this is needed as we added openAi api it will get data in jSON

// SESSION 
app.use(session({
   secret: process.env.SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: {
      httpOnly: true,
      secure: false,
      sameSite:"lax"   
   }

}));

// API AUTH MIDDLEWARE 

function requireAuth(req, res, next) {
   if (!req.session.user) {
      return res.status(401).json({ error: "Not authenticated" }); // redirect if not logged in
   }
   next();
}

// DATA BASE Connection
const db = new pg.Pool({
   user: process.env.PG_USER,
   host: process.env.PG_HOST,
   database: process.env.PG_DATABASE,
   password: process.env.PG_PASSWORD,
   port: process.env.PG_PORT,
});
console.log(process.env.PG_PASSWORD);

db.connect();


app.set("view engine", "ejs");
app.use(express.static("public"));



// GET ROUTES

app.get("/", (req, res) => res.render("login"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));


app.get("/logout", (req, res) => {
   req.session.destroy(() => {
      res.redirect("/login");
   });
});


// REGISTRATION Logic

app.post("/register", async (req, res) => {

   const email = req.body.email.trim().toLowerCase();
   const password = req.body.password;
   const confirm_password = req.body.confirm_password;

   // PASSWORD MATCH CHECK
   if (password !== confirm_password) {
      return res.send(`<script>alert("Passwords do not match"); window.location="/register";</script>`);
   }


   const existing = await db.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
   );

   if (existing.rows.length > 0) {
      return res.send(`<script>alert("User already exists. Try logging in."); window.location="/login";</script>`);
   }

   const hashedPassword = await bcrypt.hash(password, 10);

   await db.query(
      "INSERT INTO users(email,password) VALUES($1,$2)",
      [email, hashedPassword]
   );

   res.send(`<script>alert("Registration successful"); window.location="/login";</script>`);
});


// LOGIN Logic

app.post("/login", async (req, res) => {

   try {
      const email = req.body.email.trim().toLowerCase();
      const password = req.body.password;

      const result = await db.query(
         "SELECT * FROM users WHERE email=$1",
         [email.trim()]  // this trims helps to remove indexing and gaps problem
      );


      // email NOT FOUND
      if (result.rows.length === 0) {
         return res.send(`<script>alert("Email does not exist."); window.location="/register";</script>`);
      }

      const user = result.rows[0];

      // PASSWORD CHECK
      const match = await bcrypt.compare(password, user.password);

      if (!match) {
         return res.send(`<script>alert("Password is wrong"); window.location="/login";</script>`);
      }

      // LOGIN SUCCESS
      req.session.user = user.id;

      console.log("EMAIL RECEIVED:", `"${email}"`);
      console.log(result.rows);

      res.redirect("/app");
   } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
   }
});



// NOTES API

app.get("/api/notes", requireAuth, async (req, res) => {

   const result = await db.query(
      "SELECT * FROM notes WHERE user_id=$1 ORDER BY id DESC",
      [req.session.user]
   );

   res.json(result.rows);
});


// add new note
app.post("/api/notes", requireAuth,async (req, res) => {

   const { title, content } = req.body; 

   if (!content || !content.trim()) {
      return res.status(400).json({ error: "Invalid note" });
   }

   const result = await db.query(
      "INSERT INTO notes(user_id,title,content) VALUES($1,$2,$3) RETURNING *",
      [req.session.user, title, content]
   );

   res.json(result.rows[0]);
});


// delete note
app.delete("/api/notes/:id", requireAuth, async (req, res) => {

   await db.query(
      "DELETE FROM notes WHERE id=$1 AND user_id=$2",
      [req.params.id, req.session.user]
   );

   res.sendStatus(200);
});

//                               OPEN AI API

app.post("/api/ai/chat", requireAuth, async (req, res) => {

   try {

      const { message } = req.body;

      if (!message || !message.trim()) {
         return res.status(400).json({ error: "Empty message" });
      }

      // fetch user notes for context to understand

      // taking user question
      const userMessage = message.toLowerCase();

      // Fetch only notes containing keywords (simple relevance search)
      const notes = await db.query(
         ` SELECT title, content FROM notes WHERE user_id=$1
         AND ( LOWER(title) LIKE '%' || $2 || '%' OR LOWER(content) LIKE '%' || $2 || '%') LIMIT 5 `,

         [req.session.user, userMessage]
      );

      const notesContext = notes.rows
         .map(n => `Title: ${n.title}\nContent: ${n.content}`)
         .join("\n\n");


      // Call OpenAI
      const response = await openai.chat.completions.create({
         model: "gpt-4o-mini",
         messages: [
            {
               role: "system",
               content: `You are Guardian, a secure AI assistant helping user manage private notes. Use notes context when useful.`
            },
            {
               role: "system",
               content: `User notes:\n${notesContext}`
            },
            {
               role: "user",
               content: message
            }
         ]
      });

      const reply = response.choices[0].message.content;

      res.json({ reply });

   } catch (err) {
      console.error(err);
      res.status(500).json({ error: "AI failed" });
   }

});


app.use(express.static(path.join(__dirname, "client","dist")));

app.use(requireAuth, (req, res) => {
   res.sendFile(path.join(__dirname, "client","dist", "index.html"));
});

app.get("/app", requireAuth, (req,res)=>{
   res.sendFile(path.join(__dirname,"client","dist","index.html"));
});



// Starting server
app.listen(PORT, () => {
   console.log(`Server running on http://localhost:${PORT}`);
});
