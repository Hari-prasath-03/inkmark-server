import {
  clearUserTrash,
  deleteFromTrash,
  getAllTrash,
  restoreFromTrash,
} from "../utils/firebaseMethods.js";

export const getTrash = async (req, res) => {
  try {
    const { userId } = req.user;
    const userFiles = await getAllTrash(userId);

    res.status(200).json({ success: true, data: userFiles || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const restoreMd = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    await restoreFromTrash(id, userId);
    res.status(200).json({
      success: true,
      message: "Restored successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deletePermenently = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    await deleteFromTrash(id, userId);
    res.status(200).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearTrash = async (req, res) => {
  try {
    const { userId } = req.user;
    await clearUserTrash(userId);

    res.status(200).json({
      success: true,
      message: "Trash cleared successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
