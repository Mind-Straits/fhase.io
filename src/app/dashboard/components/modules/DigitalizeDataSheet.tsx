// DigitalizeDataSheet.tsx
import { CellData } from "@/app/components/DataTypes/types";

import React, { useState, useEffect } from "react";
import firebaseFirestore from "@/app/firebase/firebaseFirestoreQueries";

interface DigitalizeDataSheetProps {
  pdfName: string;
  uid: string;
  onUpdate: (uid: string, pdfName: string, data: CellData[][]) => void;
}

const DigitalizeDataSheet: React.FC<DigitalizeDataSheetProps> = ({
  pdfName,
  uid,
  onUpdate,
}) => {
  const headers = [
    "Date",
    "Description",
    "Ref No",
    "Debit",
    "Credit",
    "Balance",
  ];
  const initialRow = headers.map((_, index) => ({
    value: "",
    variable: `x1y${index + 1}`,
    error: false,
  }));

  const [data, setData] = useState<
    (CellData & { error?: boolean; dateError?: boolean })[][]
  >([initialRow]);
  const [lastBalance, setLastBalance] = useState(0);

  const formatDate = (input: string) => {
    const numbers = input.replace(/\D/g, "").slice(0, 8);
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4)
      return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
    return `${numbers.slice(0, 2)}-${numbers.slice(2, 4)}-${numbers.slice(4)}`;
  };

  const validateDate = (date: string) => {
    const parts = date.split("-");
    return parts.length === 3 && parts[2].length === 4;
  };

  const calculateBalance = (
    rowIndex: number,
    value: string,
    isDebit: boolean
  ) => {
    const numValue = parseFloat(value) || 0;
    const prevBalance =
      rowIndex > 0 ? parseFloat(data[rowIndex - 1][5].value) || 0 : lastBalance;
    return isDebit ? prevBalance - numValue : prevBalance + numValue;
  };

  const addRow = () => {
    const lastRow = data[data.length - 1];
    if (
      !lastRow[0].value ||
      !lastRow[1].value ||
      !lastRow[5].value ||
      lastRow[0].dateError
    ) {
      setData((prevData) =>
        prevData.map((row, index) =>
          index === prevData.length - 1
            ? row.map((cell, cellIndex) =>
                (cellIndex === 0 || cellIndex === 1 || cellIndex === 5) &&
                (!cell.value || (cellIndex === 0 && cell.dateError))
                  ? { ...cell, error: true }
                  : cell
              )
            : row
        )
      );
      return;
    }

    const newRow = headers.map((_, index) => ({
      value: "",
      variable: `x${data.length + 1}y${index + 1}`,
      error: false,
      dateError: false,
    }));
    setData((prevData) => [...prevData, newRow]);
    setLastBalance(parseFloat(lastRow[5].value) || 0);
  };

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    setData((prevData) =>
      prevData.map((row, rIndex) =>
        rIndex === rowIndex
          ? row.map((cell, cIndex) => {
              if (cIndex === colIndex) {
                let newValue = value;
                let dateError = false;
                if (cIndex === 0) {
                  newValue = formatDate(value);
                  dateError = !validateDate(newValue);
                }
                return { ...cell, value: newValue, error: false, dateError };
              }
              if (
                (colIndex === 3 || colIndex === 4) &&
                (cIndex === 3 || cIndex === 4)
              ) {
                return { ...cell, value: cIndex === colIndex ? value : "" };
              }
              if (cIndex === 5 && (colIndex === 3 || colIndex === 4)) {
                const newBalance = calculateBalance(
                  rowIndex,
                  value,
                  colIndex === 3
                );
                return { ...cell, value: newBalance.toFixed(2), error: false };
              }
              return cell;
            })
          : row
      )
    );
  };

  const handleUpdate = async () => {
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

      onUpdate(uid, pdfName, data);
      console.log("Data updated successfully");
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  return (
    <div className="mt-4 border border-gray-300 p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">
        Digitalize Data for: {pdfName}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="border border-gray-300 p-2 bg-gray-100"
                >
                  <p className="font-bold text-black">{header}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-2">
                    <input
                      type="text"
                      value={cell.value}
                      onChange={(e) =>
                        handleCellChange(rowIndex, colIndex, e.target.value)
                      }
                      className={`w-full text-black ${
                        cell.error || cell.dateError ? "border-red-500" : ""
                      } ${
                        (colIndex === 3 && row[4].value) ||
                        (colIndex === 4 && row[3].value)
                          ? "bg-gray-200"
                          : ""
                      }`}
                      placeholder={colIndex === 0 ? "DD-MM-YYYY" : "NULL"}
                      disabled={Boolean(
                        (colIndex === 3 && row[4].value) ||
                          (colIndex === 4 && row[3].value)
                      )}
                    />
                    {cell.error && (
                      <p className="text-red-500 text-xs">Required</p>
                    )}
                    {cell.dateError && (
                      <p className="text-red-500 text-xs">Wrong format</p>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between">
        <button
          onClick={addRow}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Row
        </button>
        <button
          onClick={handleUpdate}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default DigitalizeDataSheet;
