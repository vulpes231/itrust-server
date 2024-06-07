require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { errorLogger, requestLogger } = require("./middlewares/myLoggers");
const { connectDB } = require("./configs/connectDB");
const { verifyJWT } = require("./middlewares/verifyJWT");

const PORT = process.env.PORT || 3000;
const app = express();

connectDB();

app.use(requestLogger);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(cors({ origin: true }));

app.use("/", require("./routes/root"));
app.use("/signin", require("./routes/user/signin"));
app.use("/signup", require("./routes/user/signup"));

app.use(verifyJWT);
app.use("/refresh", require("./routes/user/refresh"));
app.use("/logout", require("./routes/user/logout"));

app.use(errorLogger);

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
