// admin.tsx

import React, { useState, useEffect } from "react";
import { firebaseStorage } from "@/app/firebase/firebaseStorageQueries";
import { getDownloadURL, ref } from "firebase/storage";
import firebaseFirestore from "@/app/firebase/firebaseFirestoreQueries";

interface PDF {
  name: string;
  path: string;
}

interface PDFData {
  [uid: string]: PDF[];
}

interface UserEmails {
  [uid: string]: string;
}

const AdminPage: React.FC = () => {
  const [pdfData, setPdfData] = useState<PDFData>({});
  const [userEmails, setUserEmails] = useState<UserEmails>({});

  useEffect(() => {
    const fetchPDFs = async () => {
      const pdfs = await firebaseStorage.getAllPDFsForAllUsers();
      const groupedPDFs: PDFData = {};

      for (const pdf of pdfs) {
        const uid = pdf.path.split("/")[0];
        if (!groupedPDFs[uid]) {
          groupedPDFs[uid] = [];
        }
        groupedPDFs[uid].push(pdf);
      }

      setPdfData(groupedPDFs);

      // Fetch user emails after PDFs are set
      const emails = await firebaseFirestore.getAllUserEmails();
      console.log("Fetched emails:", emails);
      setUserEmails(emails as UserEmails);
    };

    fetchPDFs();
  }, []);

  const handleDownload = async (pdfPath: string) => {
    const downloadURL = await getDownloadURL(
      ref(firebaseStorage.storage, pdfPath)
    );
    window.open(downloadURL, "_blank");
  };

  return (
    <div className="p-6">
      {Object.entries(pdfData).map(([uid, pdfs]) => (
        <div key={uid} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            {userEmails[uid] || uid}
          </h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-200 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-sm font-medium text-gray-600">
                    PDF Name
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {pdfs.map((pdf) => (
                <tr key={pdf.path}>
                  <td className="border-b border-blue-gray-200 py-4 px-6">
                    <p
                      className="block antialiased font-sans text-sm text-blue-500 cursor-pointer hover:underline"
                      onClick={() => handleDownload(pdf.path)}
                    >
                      {pdf.name}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
