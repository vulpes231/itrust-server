require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { errorLogger, requestLogger } = require("./middlewares/myLoggers");

const PORT = process.env.PORT || 3000;
const app = express();

app.use(requestLogger);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: true }));

app.use("/", require("./routes/root"));
app.use("/signin", require("./routes/user/signin"));

app.use(errorLogger);

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
