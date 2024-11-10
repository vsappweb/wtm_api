const router = require("express").Router();
const fs = require("fs");
const path = require("path");

router.delete("/:filename", (req, res) => {
  const filename = req.params.filename;
  const dirPath= req.body.dirPath;

  if (!filename || typeof filename !== "string") {
    return res.status(400).json("Invalid filename");
  }

  if (dirPath !== undefined && typeof dirPath !== "string") {
    return res.status(400).json("Invalid directory path");
  }
  if (dirPath === undefined) {
    return res.status(400).json(`Invalid directory path undefined`);
  }

  let filePath;
  if (dirPath) {
    filePath = path.join(__dirname, `../public/images/${dirPath}/`, filename);
  } else {
    filePath = path.join(__dirname, "../public/images/", filename);
  }

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json(`File deleted: ${dirPath} and ${filePath} .`);
    } else {
      res.status(404).json(`File not found: ${dirPath} and ${filePath} .`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(`An error occurred ${dirPath} and ${filePath} .`);
  }
});

module.exports = router;