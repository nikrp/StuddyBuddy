const express = require('express');
const http = require('http');
const cors = require('cors');
const { Pool } = require('pg');
const socketIo = require('socket.io');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    database: 'studdybuddy',
    password: 'haiPost123#'
});

pool.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, fName TEXT NOT NULL, lName TEXT, email VARCHAR(100) NOT NULL UNIQUE, username VARCHAR(30) NOT NULL UNIQUE, password TEXT NOT NULL, interests VARCHAR(500))`);
pool.query(`CREATE TABLE IF NOT EXISTS tasks (id SERIAL PRIMARY KEY, taskName VARCHAR(41) NOT NULL, taskDescription TEXT NOT NULL, priority TEXT NOT NULL, dueDate DATE NOT NULL, username TEXT NOT NULL)`);

function createDm(personOne, personTwo) {
    const res = [personOne, personTwo].sort();
    const tableName = `${res[0]}_${res[1]}`;
    const queryText = `CREATE TABLE IF NOT EXISTS ${tableName} (id SERIAL PRIMARY KEY, message TEXT, sender TEXT)`;

    pool.query(queryText, (err, result) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table created successfully');
        }
    });
}

function sendMessage(sender, tableName, message) {
    const queryText = `INSERT INTO ${tableName} (message, sender) VALUES ($1, $2)`;

    pool.query(queryText, [message, sender], (err, result) => {
        if (err) {
            console.error("Error inserting message:", err);
        } else {
            console.log("Message Inserted Succesfully");
        }
    })
}

async function getTablesContainingString(searchString) {
    try {
        // Query to retrieve table names containing the specified string
        const queryText = `
            SELECT table_name
            FROM information_schema.tables
            WHERE table_name LIKE '%${searchString}%'
                AND table_schema = 'public';  -- Assuming tables are in the public schema
        `;

        // Execute the query
        const result = await pool.query(queryText);

        // Extract table names from the query result
        const tableNames = result.rows.map(row => row.table_name);

        return tableNames;
    } catch (error) {
        console.error('Error retrieving tables:', error);
        throw error;
    }
}

// Usage example
// getTablesContainingString('nickle').then(tableNames => {
//     console.log('Tables containing "nickle":', tableNames);
// }).catch(error => {
//     // Handle error
// });


// createDm("nickle", "siddhurp");

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET, POST"],
    }
});

const rooms = [];

// Define socket.io logic here
io.on('connection', (socket) => {
    console.log('A user connected');

    // Example event handling
    socket.on('message', (data) => {
        console.log('Received example event:', data);
        sendMessage(data.sender, data.tableName, data.msg);
    });

    socket.on('disconnect', (reason) => {
        console.log("User has disconnected");
    })

    // More socket.io logic...
});

// Route for Registering
app.post('/users/register', function (req, res, next) {
    const { fName, lName, username, email, password } = req.body;
    
    pool.query(`INSERT INTO users (fName, lName, email, username, password, interests) VALUES ($1, $2, $3, $4, $5, $6)`, [fName, lName, email, username, password, "Programming, Python, Coding, JavaScript, Web Dev, Websites, Html, Css, Arduino."], (err, results) => {
        if (err) {
            res.status(200).json({ error: err.constraint.split("_")[1] });
        } else {
            res.status(200).json({ msg: "Hello" });
        }
    });
});

app.post('/users/login', function (req, res, next) {
    const { emailUsername, password } = req.body;
    

    pool.query(`SELECT * FROM users WHERE (email = $1 OR username = $1) AND password = $2`, [emailUsername, password], (err, result) => {
        if (err) {
            console.error("Error selecting data from users:", error);
        } else {
            if (result.rows.length > 0) {
                res.status(200).json({ msg: "Welcome " + result.rows[0].fname + " " + result.rows[0].lname, username: result.rows[0].username});
            } else {
                res.status(200).json({ error: "form" });
            }
        }
    });
})

app.post('/tasks/create', function (req, res, next) {
    pool.query(`INSERT INTO tasks (taskname, taskdescription, priority, duedate, username) VALUES ($1, $2, $3, $4, 'nickle')`, [req.body.name, req.body.description, req.body.priority, req.body.dueDate], (err, result) => {
        if (err) {
            console.error("Error inserting task:", err);
        } else {
            res.json({msg: "HEllo"});
        }
    });
});

app.post('/tasks/get', function (req, res, next) {
    pool.query(`SELECT * FROM tasks WHERE username = $1`, [req.body.username], (err, results) => {
        if (err) {
            console.error("Error fetching tasks in /tasks/get:", err);
        } else {
            res.json(results.rows);
        }
    })
});

app.get('/users/get', function (req, res, next) {
    pool.query(`SELECT * FROM users`, [], (err, results) => {
        if (err) {
            console.error("Error fetching all users:", err);
        } else {
            res.json(results.rows);
        }
    });
});

app.post('/tasks/complete', function (req, res, next) {
    pool.query(`DELETE FROM tasks WHERE id = $1`, [req.body.id], (err, results) => {
        if (err) {
            console.error("Error completing task in /tasks/complete:", err);
        } else {
            res.json(results);
        }
    });
});

app.post('/chats/get', async function (req, res, next) {
    try {
        const chats = await getTablesContainingString(req.body.username);
        let newChats = [];

        // Map each chat table to a promise that resolves with the chat data
        const chatPromises = chats.map(async (chat) => {
            try {
                const result = await pool.query(`SELECT * FROM ${chat}`);
                newChats.push({name: chat, msgData: result.rows});
            } catch (err) {
                console.error("Error fetching chat:", err);
            }
        });

        // Wait for all chat promises to resolve
        await Promise.all(chatPromises);

        // Send the response after all queries have completed
        res.json(newChats);
    } catch (error) {
        console.error('Error getting chats:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

server.listen(5000, 'localhost', () => {
    console.log("Server listening on port 5000!");
});