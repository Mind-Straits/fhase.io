import React, { useEffect, useState } from "react";
import firebaseFirestore from "@/app/firebase/firebaseFirestoreQueries";
import Image from "next/image";
import DigitalizeDataSheet from "./modules/DigitalizeDataSheet";
import { CellData } from "@/app/components/DataTypes/types";

interface TableContentProps {
  uid: string;
}

const TableContent: React.FC<TableContentProps> = ({ uid }) => {
  const [documents, setDocuments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await firebaseFirestore.getDigitalizedData(uid);
        setDocuments(Object.keys(data));
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [uid]);

  const truncateFileName = (fileName: string) => {
    if (fileName.length <= 9) return fileName;
    const extension = fileName.split(".").pop();
    const name = fileName.substring(0, fileName.lastIndexOf("."));
    return `${name.substring(0, 5)}...${extension}`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-xl text-gray-600">Loading documents...</p>
      </div>
    );
  }

  return (
    <div
      className={`grid ${
        expandedDoc
          ? "grid-cols-1"
          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      } gap-x-2 gap-y-6`}
    >
      {documents.map((docName) => (
        <div key={docName}>
          <div
            className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white w-32 h-35 cursor-pointer"
            title={docName}
            onClick={() =>
              setExpandedDoc(expandedDoc === docName ? null : docName)
            }
          >
            <Image src="/pdfLogo.png" alt="PDF Logo" width={48} height={48} />
            <p className="mt-2 text-center text-xs font-medium text-gray-700 break-words w-full">
              {truncateFileName(docName)}
            </p>
          </div>
          {expandedDoc === docName && (
            <DigitalizeDataSheet
              pdfName={docName}
              uid={uid}
              onUpdate={(uid, pdfName, data) => {
                // Handle update if needed
              }}
              onFetchData={async (uid, pdfName) => {
                try {
                  const data = await firebaseFirestore.getDocumentById(
                    `user/${uid}/digitalized_data`,
                    pdfName
                  );
                  if (!data) return null;

                  const headers = [
                    "Date",
                    "Description",
                    "Ref No",
                    "Debit",
                    "Credit",
                    "Balance",
                  ];
                  const rows: CellData[][] = [];

                  for (let i = 1; ; i++) {
                    const row: CellData[] = [];
                    let isEmpty = true;

                    for (let j = 1; j <= headers.length; j++) {
                      const key = `x${i}y${j}`;
                      const value = data[key] || "";
                      if (value) isEmpty = false;
                      row.push({ value, variable: key });
                    }

                    if (isEmpty) break;
                    rows.push(row);
                  }

                  return rows;
                } catch (error) {
                  console.error("Error fetching data:", error);
                  return null;
                }
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default TableContent;
