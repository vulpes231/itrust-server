require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { errorLogger, requestLogger } = require("./middlewares/myLoggers");
const { connectDB } = require("./configs/connectDB");
const { verifyJWT } = require("./middlewares/verifyJWT");
const { corsOptions } = require("./configs/corsOption");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const upload = multer({ dest: "uploads/" }).fields([
  { name: "passport", maxCount: 1 },
  { name: "idFront", maxCount: 1 },
  { name: "idBack", maxCount: 1 },
  { name: "utility", maxCount: 1 },
]);

const { verifyKYC } = require("./handlers/user/userVerifyHandler");

// Define the directory path
const uploadDirectory = path.join(__dirname, "uploads");

// Ensure the directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const PORT = process.env.PORT || 3000;
const app = express();

connectDB();

app.use(cors(corsOptions));

app.use(requestLogger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(bodyParser());
app.use(cookieParser());

app.use("/", require("./routes/root"));
app.use("/signin", require("./routes/user/signin"));
app.use("/signup", require("./routes/user/signup"));
// admin
app.use("/login", require("./routes/admin/login"));
app.use("/create", require("./routes/admin/create"));

app.use(verifyJWT);
app.post("/verify", upload, verifyKYC);
app.use("/refresh", require("./routes/user/refresh"));
app.use("/user", require("./routes/user/user"));
app.use("/logout", require("./routes/user/logout"));
app.use("/account", require("./routes/user/account"));
app.use("/transaction", require("./routes/user/transaction"));
app.use("/bot", require("./routes/user/bot"));
app.use("/trade", require("./routes/user/trade"));
app.use("/docs", require("./routes/user/docu"));
app.use("/plans", require("./routes/user/plan"));

// admin route
app.use("/users", require("./routes/admin/manageuser"));
app.use("/trnx", require("./routes/admin/managetrnx"));
app.use("/wallet", require("./routes/admin/manageaccts"));
app.use("/managebot", require("./routes/admin/managebot"));
app.use("/signout", require("./routes/admin/logout"));
app.use("/managetrade", require("./routes/admin/trade"));
app.use("/managedocs", require("./routes/admin/managedocu"));
app.use("/manageplans", require("./routes/admin/manageplans"));
app.use("/walletaddress", require("./routes/admin/walletcontrol"));

app.use(errorLogger);

app.listen(PORT, () =>
  console.log(`Server started on http://localhost:${PORT}`)
);
