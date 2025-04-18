import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase.js";

const parseUserId = (userId) => userId.split("-").at(-1);

/* =========================== DB -> data location anf referance map  =============================== */

const usersLocation = [db, "InkMark", "userDB", "users"];
const filesLocation = (userDoc) => [...usersLocation, userDoc, "files"];
const historyLocation = (userDoc) => [...usersLocation, userDoc, "history"];
const trashLocation = (userDoc) => [...usersLocation, userDoc, "trash"];

const userRef = (docId) => doc(...usersLocation, docId);
const fileRef = (userDoc, fileId) => doc(...filesLocation(userDoc), fileId);
const historyRef = (userDoc, fileId) =>
  doc(...historyLocation(userDoc), fileId);
const trashRef = (userDoc, fileId) => doc(...trashLocation(userDoc), fileId);

/* ============================== user set & get  ========================================= */

export const setUser = async (docId, user) => {
  await setDoc(userRef(docId), user);
};

export const findUserByMail = async (email) => {
  const usersCollectionRef = collection(...usersLocation);
  const q = query(usersCollectionRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data();
};

export const findUserById = async (userId) => {
  const usersCollectionRef = collection(...usersLocation);
  const q = query(usersCollectionRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data();
};

/* ============================== md file CRUD operations  ========================================= */

export const getMdFileById = async (docId, userId, location) => {
  const userDoc = parseUserId(userId);
  const fileRef = doc(...location(userDoc), docId);
  const fileSnapshot = await getDoc(fileRef);
  if (!fileSnapshot.exists()) return null;
  return fileSnapshot.data();
};

export const getSingleFileById = async (userId, docId) => {
  const userDoc = parseUserId(userId);
  const fileRef = doc(...filesLocation(userDoc), docId);
  const fileSnapshot = await getDoc(fileRef);
  if (!fileSnapshot.exists()) return null;
  return fileSnapshot.data();
};

export const getAllFilesByUserId = async (userId) => {
  const userDoc = parseUserId(userId);
  const filesRef = collection(...filesLocation(userDoc));
  const filesSnapshot = await getDocs(filesRef);
  if (filesSnapshot.empty) return null;
  return filesSnapshot.docs.map((doc) => doc.data());
};

export const setMdFile = async (doc, userId) => {
  const id = Date.now().toString();
  doc.id = id;
  doc.isFavorite = false;
  const userDoc = parseUserId(userId);
  await setDoc(fileRef(userDoc, id), doc);
  await addHistory(userDoc, id, "created", doc.fileName);
};

export const updateMdFile = async (doc, userId) => {
  const userDoc = parseUserId(userId);
  await updateDoc(fileRef(userDoc, doc.id), { ...doc });
  await addHistory(userDoc, doc.id, "edited", doc.fileName);
};

export const deleteMdFile = async (docId, userId) => {
  const userDoc = parseUserId(userId);
  const file = await getMdFileById(docId, userDoc, filesLocation);
  await moveToTrash(userDoc, file);
  await deleteDoc(fileRef(userDoc, docId));
  await addHistory(userDoc, docId, "deleted", file.fileName);
};

/* ================================ user history management =================================== */

// history schema
class History {
  constructor(fileId, action, fileName) {
    this.id = Date.now().toString();
    this.fileId = fileId;
    this.action = action;
    this.fileName = fileName;
    this.timestamp = new Date().toISOString();
  }
}

export const addHistory = async (userDoc, fileId, action, fileName) => {
  const history = new History(fileId, action, fileName);
  await setDoc(historyRef(userDoc, history.id), { ...history });
};

export const getUserHistory = async (userId) => {
  const userDoc = parseUserId(userId);
  const historyRef = collection(...historyLocation(userDoc));
  const historySnapshot = await getDocs(historyRef);
  if (historySnapshot.empty) return null;
  return historySnapshot.docs.map((doc) => doc.data());
};

export const deleteUserHistory = async (userId, historyId) => {
  const userDoc = parseUserId(userId);
  await deleteDoc(historyRef(userDoc, historyId));
};

export const clearUserHistory = async (userId) => {
  const userDoc = parseUserId(userId);
  const historyCol = collection(...historyLocation(userDoc));
  const snapshot = await getDocs(historyCol);
  if (snapshot.empty) return;
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
};

/* ============================ trash management ============================== */

export const getAllTrash = async (userId) => {
  const userDoc = parseUserId(userId);
  const trashRef = collection(...trashLocation(userDoc));
  const trashSnapshot = await getDocs(trashRef);
  if (trashSnapshot.empty) return null;
  return trashSnapshot.docs.map((doc) => doc.data());
};

export const moveToTrash = async (userDoc, file) => {
  const autoDelete = 7 * 24 * 60 * 60 * 1000;
  await setDoc(trashRef(userDoc, file.id), {
    ...file,
    deletedAt: Date.now() + autoDelete,
  });
};

export const restoreFromTrash = async (fileId, userId) => {
  const userDoc = parseUserId(userId);
  const file = await getMdFileById(fileId, userDoc, trashLocation);
  delete file.deletedAt;
  await setDoc(fileRef(userDoc, file.id), { ...file });
  await addHistory(userDoc, file.id, "restored", file.fileName);
  await deleteDoc(trashRef(userDoc, file.id));
};

export const deleteFromTrash = async (fileId, userId) => {
  const userDoc = parseUserId(userId);
  await deleteDoc(trashRef(userDoc, fileId));
};

export const clearUserTrash = async (userId) => {
  const userDoc = parseUserId(userId);
  const trashCol = collection(...trashLocation(userDoc));
  const snapshot = await getDocs(trashCol);
  if (snapshot.empty) return;
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  return Promise.all(deletePromises);
};

/* ============================ favorite management ============================== */

export const favoriteMd = async (fileId, userId) => {
  const userDoc = parseUserId(userId);
  const file = await getMdFileById(fileId, userDoc, filesLocation);
  await updateDoc(fileRef(userDoc, file.id), {
    ...file,
    isFavorite: !file?.isFavorite,
  });
  return { isFav: file?.isFavorite, fileName: file.fileName };
};
