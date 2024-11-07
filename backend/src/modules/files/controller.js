const path = require("path");
const multer = require("multer");
const { File, Project } = require("../../DB/mongodb");
const axios = require("axios");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../../../uploads"));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const mimeType = allowedTypes.test(file.mimetype);
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  if (mimeType && extName) {
    return cb(null, true);
  }
  cb(new Error("Only image files (jpeg, jpg, png) are allowed"));
};

exports.upload = multer({ storage, fileFilter });

exports.addFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    let {
      userId,
      projectId,
      surname,
      doorNumber,
      windowNumber,
      textNumber,
      aiContent,
    } = req.body;
    const imagePath = req.file.path;

    // Apply model
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const data = {
      coded_file: base64Image,
    };
    let annotatedImage = 0;
    const response = await axios
      .get("http://127.0.0.1:8000/file", data)
      .then((response) => {
        responseData = response.data;
        console.log("Response: ");
        doorNumber = responseData.doors;
        windowNumber = responseData.windows;
        textNumber = responseData.texts;
        // It's in base64, so conversion is needed to turn it into a image
        annotatedImage = responseData.annotated_file;
      })
      .catch((error) => {
        console.error("Error: ", error);
      });

    // This shold convert the base64 string to a image buffer.
    // This should work to save the annotated image with what is being used
    const buffer = Buffer.from(annotatedImage, "base64");

    const newFile = new File({
      userId,
      projectId,
      surname,
      doorNumber,
      windowNumber,
      textNumber,
      imagePath,
      aiContent,
    });
    await newFile.save();

    await Project.findByIdAndUpdate(
      projectId,
      { $push: { files: newFile._id } },
      { new: true },
    );
    res.status(201).json({ message: "File added successfully", file: newFile });
  } catch (error) {
    res.status(500).json({ message: "Error adding file", error });
  }
};

exports.getFileById = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: "File not found" });
    res.status(200).json({ file });
  } catch (err) {
    res.status(500).json({ message: "Error getting file", error });
  }
};

exports.updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updateFile = await File.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updateFile) return res.status(404).json({ message: "File not found" });
    res
      .status(200)
      .json({ message: "File updated successfully", file: updateFile });
  } catch (err) {
    res.status(500).json({ message: "Error updating file", error });
  }
};

exports.deleteFile = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedFile = await File.findByIdAndDelete(id);
    if (!deletedFile)
      return res.status(404).json({ message: "File not found" });
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting file", error });
  }
};
