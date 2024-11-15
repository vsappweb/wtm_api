const router = require("express").Router();
const multer = require("multer");
const path = require("path");

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

const upload = multer({ storage: storage("") });
const uploadAvatar = multer({ storage: storage("person/usersAvatars") });
const uploadCountry = multer({ storage: storage("slider/countries") });
const uploadRegion = multer({ storage: storage("slider/regions") });
const uploadCity = multer({ storage: storage("slider/cities") });
const uploadNote = multer({ storage: storage("post/notes") });

const handleUpload = (uploadFn) => (req, res) => {
  uploadFn(req, res, (err) => {
    if (err || !req.files || req.files.length === 0) {
      return res.status(400).json(err || "No file uploaded");
    }
    res.status(200).json("File uploaded successfully.");
  });
};

router.post("/upload", handleUpload(upload.any("file")));
router.post("/userAvatar", handleUpload(uploadAvatar.any("file")));
router.post("/country", handleUpload(uploadCountry.any("file")));
router.post("/region", handleUpload(uploadRegion.any("file")));
router.post("/city", handleUpload(uploadCity.any("file")));
router.post("/note", handleUpload(uploadNote.any("file")));

module.exports = router;

