const express = require('express');
const connectDB = require('./config/db');
const cors = require("cors");

const app = express();
app.use(cors());

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

// connect DB
connectDB();

app.use(express.json({ extended: false}));

const PORT = process.env.PORT || 5000;

app.get('/', (req, resp) => resp.send('API Running'));

// Define routes
app.use('/api/users', require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use("/api/profile", require("./routes/api/profile"));

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));