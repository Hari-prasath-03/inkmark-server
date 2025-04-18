import { Router } from "express";
import {
  deleteMd,
  getMyMds,
  updateMd,
  uploadMd,
  addRemoveToFavorite,
  getMyById,
  getFavourite,
} from "../controllers/controller.md.js";
import {
  clearHistory,
  deleteHistory,
  getAllHistory,
} from "../controllers/controller.history.js";
import {
  clearTrash,
  deletePermenently,
  getTrash,
  restoreMd,
} from "../controllers/controller.trash.js";
import protectedRoute from "../middleware/protected.js";

const router = Router();

router.get("/my-md", protectedRoute, getMyMds); //
router.get("/my-md/:id", protectedRoute, getMyById); //
router.post("/upload-md", protectedRoute, uploadMd); //
router.put("/update-md", protectedRoute, updateMd); //
router.delete("/move-to-trash/:fileId", protectedRoute, deleteMd); //

router.post("/add-remove-to-favorite/:id", protectedRoute, addRemoveToFavorite); //
router.get("/get-favorite", protectedRoute, getFavourite); //

router.get("/get-history", protectedRoute, getAllHistory); //
router.delete("/delete-history/:id", protectedRoute, deleteHistory); //
router.delete("/clear-history", protectedRoute, clearHistory); //

router.get("/get-trash", protectedRoute, getTrash); //
router.post("/restore-from-trash/:id", protectedRoute, restoreMd); //
router.delete("/delete-trash/:id", protectedRoute, deletePermenently); //
router.delete("/clear-trash", protectedRoute, clearTrash); //

export default router;
