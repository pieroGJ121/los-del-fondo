const { File } = require('../../DB/mongodb');

exports.addFile = async (req, res) => {
  try {
    const { userId, projectId, surname, doorNumber, windowNumber, textNumber, image, aiContent } = req.body;
    const newFile = new File({
      userId,
      projectId,
      surname,
      doorNumber,
      windowNumber,
      textNumber,
      image,
      aiContent,
    });
    await newFile.save();
    res.status(201).json({ message: 'File added successfully', file: newFile });
  } catch (error) {
    res.status(500).json({ message: 'Error adding file', error });
  }
};
