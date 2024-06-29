// admin.tsx

import React, { useState, useEffect } from "react";
import { firebaseStorage } from "@/app/firebase/firebaseStorageQueries";
import { getDownloadURL, ref } from "firebase/storage";
import firebaseFirestore from "@/app/firebase/firebaseFirestoreQueries";
import DigitalizeDataSheet from "@/app/dashboard/components/modules/DigitalizeDataSheet";
import { CellData } from "@/app/components/DataTypes/types";
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

  const [expandedPdf, setExpandedPdf] = useState<string | null>(null);

  const handleDownload = async (pdfPath: string) => {
    const downloadURL = await getDownloadURL(
      ref(firebaseStorage.storage, pdfPath)
    );
    window.open(downloadURL, "_blank");
  };

  const handleDigitalizeData = (pdfName: string) => {
    setExpandedPdf(expandedPdf === pdfName ? null : pdfName);
  };

  const handleUpdateData = async (
    uid: string,
    pdfName: string,
    data: CellData[][]
  ) => {
    console.log(`Updating data for user ${uid}, PDF ${pdfName}:`, data);
    try {
      const formattedData: { [key: string]: string } = {
        pdfName: pdfName,
      };

      data.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          formattedData[`x${rowIndex + 1}y${colIndex + 1}`] = cell.value;
        });
      });

      await firebaseFirestore.createOrUpdateDocument(
        `user/${uid}/digitalized_data`,
        pdfName,
        formattedData
      );

      console.log("Data updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  const handleFetchData = async (uid: string, pdfName: string) => {
    try {
      const docData = await firebaseFirestore.getDocumentById(
        `user/${uid}/digitalized_data`,
        pdfName
      );
      if (docData) {
        // Convert the document data back into the CellData[][] format
        const rows: CellData[][] = [];

        Object.entries(docData).forEach(([key, value]) => {
          if (key === "pdfName") return; // Skip the pdfName field

          const match = key.match(/x(\d+)y(\d+)/);
          if (match) {
            const [, rowStr, colStr] = match;
            const row = parseInt(rowStr) - 1;
            const col = parseInt(colStr) - 1;

            if (!rows[row]) {
              rows[row] = [];
            }

            rows[row][col] = { value: value as string, variable: key };
          }
        });

        // Fill in any missing cells with empty data
        const filledRows = rows.map((row) =>
          Array(6)
            .fill(null)
            .map(
              (_, index) =>
                row[index] || {
                  value: "",
                  variable: `x${rows.indexOf(row) + 1}y${index + 1}`,
                }
            )
        );

        return filledRows;
      }
      return null;
    } catch (error) {
      console.error("Error fetching document:", error);
      return null;
    }
  };

  return (
    <div className="p-6">
      {Object.entries(pdfData).map(([uid, pdfs]) => (
        <div key={uid} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            {userEmails[uid] ? (
              userEmails[uid]
            ) : (
              <div className="flex items-left justify-left">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
              </div>
            )}
          </h2>
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border-b border-blue-gray-200 py-3 px-6 text-left">
                  <p className="block antialiased font-sans text-sm font-medium text-gray-600">
                    PDF Name
                  </p>
                </th>
                <th className="border-b border-blue-gray-200 py-3 px-6 text-right">
                  <p className="block antialiased font-sans text-sm font-medium text-gray-600">
                    Action
                  </p>
                </th>
              </tr>
            </thead>
            <tbody>
              {pdfs.map((pdf) => (
                <React.Fragment key={pdf.path}>
                  <tr>
                    <td className="border-b border-blue-gray-200 py-4 px-6">
                      <p
                        className="block antialiased font-sans text-sm text-blue-500 cursor-pointer hover:underline"
                        onClick={() => handleDownload(pdf.path)}
                      >
                        {pdf.name}
                      </p>
                    </td>
                    <td className="border-b border-blue-gray-200 py-4 px-6 text-right">
                      <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => handleDigitalizeData(pdf.name)}
                      >
                        Digitalize Data
                      </button>
                    </td>
                  </tr>
                  {expandedPdf === pdf.name && (
                    <tr>
                      <td colSpan={2}>
                        <DigitalizeDataSheet
                          pdfName={pdf.name}
                          uid={uid}
                          onUpdate={handleUpdateData}
                          onFetchData={handleFetchData}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default AdminPage;
