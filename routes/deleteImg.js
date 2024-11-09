const router = require("express").Router();
const fs = require("fs");
const path = require("path");

router.delete("/:filename", (req, res) => {
  const filename = req.params.filename;
  const dirPath = req.body.dirPath;

  if (!dirPath) {
    const filePath = path.join(__dirname, "../public/images/", filename);

    if (!filename) {
      return res.status(400).json("Filename is required");
    }

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.status(200).json("File deleted");
      } else {
        res.status(404).json("File not found");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    const filePath = path.join(
      __dirname,
      "../public/images/",
      dirPath,
      filename
    );
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.status(200).json("File deleted");
      } else {
        res.status(404).json("File not found");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  }
});

module.exports = router;
