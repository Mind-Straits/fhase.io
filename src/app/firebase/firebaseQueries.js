import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";

class FirebaseFirestore {
  constructor() {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    this.db = getFirestore(app);
  }

  // Read a single document by ID
  async getDocumentById(collectionName, documentId) {
    const docRef = doc(this.db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error("Document not found");
    }
  }

  // Read all documents in a collection
  async getAllDocuments(collectionName) {
    const collectionRef = collection(this.db, collectionName);
    const querySnapshot = await getDocs(collectionRef);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents;
  }

  // Query documents based on a condition
  async queryDocuments(collectionName, field, operator, value) {
    const collectionRef = collection(this.db, collectionName);
    const q = query(collectionRef, where(field, operator, value));
    const querySnapshot = await getDocs(q);
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return documents;
  }

  // Create a new document
  async createDocument(collectionName, documentId, data) {
    const docRef = doc(this.db, collectionName, documentId);
    await setDoc(docRef, data);
  }

  // Update an existing document
  async updateDocument(collectionName, documentId, data) {
    const docRef = doc(this.db, collectionName, documentId);
    await updateDoc(docRef, data);
  }

  // Delete a document
  async deleteDocument(collectionName, documentId) {
    const docRef = doc(this.db, collectionName, documentId);
    await deleteDoc(docRef);
  }
}

export default new FirebaseFirestore();
