import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, listAll } from "firebase/storage";

class FirebaseStorage {
  constructor() {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    this.storage = getStorage(app);
  }
  // Count Total Pdf's
  async getTotalPDFs(uid) {
    const folderRef = ref(this.storage, `${uid}/pdf`);
    const { items } = await listAll(folderRef);
    return items.length;
  }
  // Get all pdf file name
  async getAllPDFs(uid) {
    const folderRef = ref(this.storage, `${uid}/pdf`);
    const { items } = await listAll(folderRef);
    const pdfNames = items.map((item) => item.name);
    return pdfNames;
  }
}

export const firebaseStorage = new FirebaseStorage();
