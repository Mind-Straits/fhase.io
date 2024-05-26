import { initializeApp, getApps, getApp } from "firebase/app";
import { getStorage, ref, listAll } from "firebase/storage";

class FirebaseStorage {
  constructor() {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    this.storage = getStorage(app);
  }

  async getTotalPDFs(uid) {
    const folderRef = ref(this.storage, `${uid}/pdf`);
    const { items } = await listAll(folderRef);
    return items.length;
  }
}

export const firebaseStorage = new FirebaseStorage();
