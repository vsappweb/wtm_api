const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const { exec } = require("child_process");

const storage = (folder) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `public/images/${folder}`);
    },
    filename: (req, file, cb) => {
      if (req.body && req.body.name) {
        cb(null, req.body.name);
      } else {
        cb(new Error("No name provided"), null);
      }
    },
  });

const upload = multer({ storage: storage("temp") });
const uploadAvatar = multer({ storage: storage("person/usersAvatars/temp") });
const uploadCountry = multer({ storage: storage("slider/countries/temp") });
const uploadRegion = multer({ storage: storage("slider/regions/temp") });
const uploadCity = multer({ storage: storage("slider/cities/temp") });
const uploadNote = multer({ storage: storage("post/notes/temp") });

const optimizeImage = (imagePath) => {
  const reqFile = imagePath;
  console.log("reqFile >>>", reqFile);
  const distPath = reqFile.destination;
  const dist = distPath
    .split("/")
    .slice(0, distPath.split("/").length - 1)
    .join("/");
  console.log("dist >>>", dist);
  if (!reqFile || !reqFile.path) {
    return res.status(400).send("Please upload a valid image");
  }
  const compressedImageFilePath = path.join(
    __dirname,
    `../${dist}/${reqFile.filename}`
  );
  sharp(reqFile.path)
    .resize(800, 600)
    .toFile(compressedImageFilePath)
    .then(() => {
      let sizeBeforeCompression, sizeAfterCompression;
      const sizeBeforeCompressionCommand = `du -h ${reqFile.path}`;
      const sizeAfterCompressionCommand = `du -h ${compressedImageFilePath}`;

      exec(sizeBeforeCompressionCommand, (err, stdout, stderr) => {
        if (err) {
          console.error("Error getting file size: ", err.message);
          return;
        }
        sizeBeforeCompression = stdout.trim().split("\t")[0];

        exec(sizeAfterCompressionCommand, (err, stdout, stderr) => {
          if (err) {
            console.error("Error getting file size: ", err.message);
            return;
          }
          sizeAfterCompression = stdout.trim().split("\t")[0];
          console.log(
            `Size before compression: ${sizeBeforeCompression}, size after compression: ${sizeAfterCompression}`
          );
        });
        sharp.cache({ files: 0 });
        sharp.cache(false);
        if (fs.existsSync(reqFile.path)) {
          console.log("Removing file from temporary folder");
          fs.unlinkSync(reqFile.path);
          console.log("File removed from temporary folder");
        } else {
          console.log(`File not found: ${reqFile.path}`);
        }
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "SharpError") {
        return res.status(400).send("Error processing image: " + err.message);
      }
      return res.status(500).send("Error uploading image: " + err.message);
    });
};

const handleUpload = (uploadFn) => (req, res) => {
  try {
    uploadFn(req, res, (err) => {
      if (err) {
        console.error("Upload error: ", err.message);
        return res.status(500).json("An error occurred during the upload");
      }
      if (!req.file || req.file.length === 0) {
        return res.status(400).json("No file uploaded");
      }
      try {
        optimizeImage(req.file);
        return res.status(200).json("File uploaded successfully.");
      } catch (optimizeError) {
        console.error("Optimization error: ", optimizeError.message);
        return res.status(500).json("Error processing image");
      }
    });
  } catch (unexpectedError) {
    console.error("Unexpected error: ", unexpectedError.message);
    return res.status(500).json("Unexpected error occurred");
  }
};

router.post("/upload", handleUpload(upload.single("file")));
router.post("/userAvatar", handleUpload(uploadAvatar.single("file")));
router.post("/country", handleUpload(uploadCountry.single("file")));
router.post("/region", handleUpload(uploadRegion.single("file")));
router.post("/city", handleUpload(uploadCity.single("file")));
router.post("/note", handleUpload(uploadNote.single("file")));

module.exports = router;
