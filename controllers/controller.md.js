import {
  deleteMdFile,
  getAllFilesByUserId,
  setMdFile,
  updateMdFile,
  favoriteMd,
  getSingleFileById,
} from "../utils/firebaseMethods.js";

export const getMyMds = async (req, res) => {
  try {
    const { userId } = req.user;
    const userFiles = await getAllFilesByUserId(userId);

    res.status(200).json({ success: true, data: userFiles || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const file = await getSingleFileById(userId, id);
    res.status(200).json({ success: true, data: file || null });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const uploadMd = async (req, res) => {
  try {
    const { file, fileName, createdAt } = req.body;
    const { userId } = req.user;

    await setMdFile({ file, fileName, createdAt }, userId);
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateMd = async (req, res) => {
  try {
    const document = req.body;
    const { userId } = req.user;
    await updateMdFile(document, userId);

    res.status(200).json({
      success: true,
      message: "File updated successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteMd = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { userId } = req.user;

    await deleteMdFile(fileId, userId);
    res.status(200).json({
      success: true,
      message: "Moved to trash successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const addRemoveToFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const { isFav, fileName } = await favoriteMd(id, userId);
    res.status(200).json({
      success: true,
      message: `${fileName}.md ${
        !isFav ? "added to favorite" : "removed from favorite"
      }`,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getFavourite = async (req, res) => {
  try {
    const { userId } = req.user;
    const userFiles = await getAllFilesByUserId(userId);

    const favoriteFiles = userFiles.filter((file) => file.isFavorite);
    res.status(200).json({ success: true, data: favoriteFiles || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
