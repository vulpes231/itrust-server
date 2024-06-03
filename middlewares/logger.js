const { format } = require("date-fns");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logger = async (message, fileName) => {
  const currentDate = format(new Date(), "yyyy/mm/dd\thh:mm:ss\n");
  const logItem = `${currentDate}\t${uuid()}\t${message}\n`;
  console.log(logItem);

  try {
    const logFolderPath = path.join(__dirname, "../logs");

    const filePath = path.join(logFolderPath, fileName);

    if (!fs.existsSync(logFolderPath)) {
      await fsPromises.mkdir(logFolderPath);
    }

    await fsPromises.appendFile(filePath, logItem);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { logger };
