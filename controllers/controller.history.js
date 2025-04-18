import {
  getUserHistory,
  deleteUserHistory,
  clearUserHistory,
} from "../utils/firebaseMethods.js";
  
export const getAllHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const userHistory = await getUserHistory(userId);

    res.status(200).json({ success: true, data: userHistory?.reverse() || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    await deleteUserHistory(userId, id);
    res.status(200).json({
      success: true,
      message: "History deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const clearHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    await clearUserHistory(userId);

    res.status(200).json({
      success: true,
      message: "History cleared successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
