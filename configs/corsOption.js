const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3300",
  "https://quadx.io, https://admin.quadx.io, https://server.quadx.io",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

module.exports = { corsOptions };
