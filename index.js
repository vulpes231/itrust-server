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
// admin
app.use("/login", require("./routes/admin/login"));
app.use("/create", require("./routes/admin/create"));

app.use(verifyJWT);
app.use("/refresh", require("./routes/user/refresh"));
app.use("/logout", require("./routes/user/logout"));
app.use("/account", require("./routes/user/account"));
app.use("/transaction", require("./routes/user/transaction"));

// admin route
app.use("/users", require("./routes/admin/manageuser"));
app.use("/trnx", require("./routes/admin/managetrnx"));
app.use("/wallet", require("./routes/admin/manageaccts"));

app.use(errorLogger);

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
