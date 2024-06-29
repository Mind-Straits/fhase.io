// DigitalizeDataSheet.tsx
import { CellData } from "@/app/components/DataTypes/types";
import React, { useState, useEffect } from "react";
import firebaseFirestore from "@/app/firebase/firebaseFirestoreQueries";

interface DigitalizeDataSheetProps {
  pdfName: string;
  uid: string;
  onUpdate: (uid: string, pdfName: string, data: CellData[][]) => void;
  onFetchData: (uid: string, pdfName: string) => Promise<CellData[][] | null>;
}

const DigitalizeDataSheet: React.FC<DigitalizeDataSheetProps> = ({
  pdfName,
  uid,
  onUpdate,
  onFetchData,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
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

  // handle cell data and update message
  const [data, setData] = useState<
    (CellData & { error?: boolean; dateError?: boolean })[][]
  >([initialRow]);
  const [updateMessage, setUpdateMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

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

  const validateData = (data: CellData[][]) => {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (!row[0].value || !validateDate(row[0].value)) {
        throw new Error(`Invalid date format in row ${i + 1}`);
      }
      if (!row[1].value) {
        throw new Error(`Missing description in row ${i + 1}`);
      }
      // Add more validations as needed
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    setUpdateMessage(null);
    try {
      validateData(data);

      const formattedData: { [key: string]: string } = {
        pdfName: pdfName,
      };

      data.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          formattedData[`x${rowIndex + 1}y${colIndex + 1}`] = cell.value;
        });
      });

      await firebaseFirestore.createOrUpdateDocumentBatch(
        `user/${uid}/digitalized_data`,
        pdfName,
        formattedData
      );

      onUpdate(uid, pdfName, data);
      setUpdateMessage({ type: "success", text: "Data updated successfully" });
    } catch (error) {
      console.error("Error updating data:", error);
      setUpdateMessage({
        type: "error",
        text: "An error occurred while updating data",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // If data is available populate table with data
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetData = async () => {
    setIsLoading(true);
    setUpdateMessage(null);
    try {
      const fetchedData = await onFetchData(uid, pdfName);
      if (fetchedData && fetchedData.length > 0) {
        setData(fetchedData);
        setUpdateMessage({ type: "success", text: "Data loaded successfully" });
      } else {
        setData([initialRow]);
        setUpdateMessage({
          type: "success",
          text: "No existing data found. Starting with an empty table.",
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setUpdateMessage({ type: "error", text: "Error loading data" });
      setData([initialRow]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetData();
  }, [pdfName, uid]);

  return (
    <div className="mt-4 border border-gray-300 p-4 rounded">
      <h3 className="text-lg font-semibold mb-2">
        Digitalize Data for: {pdfName}
      </h3>
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
        </div>
      ) : (
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
      )}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={addRow}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          Add Row
        </button>
        <button
          onClick={handleUpdate}
          className={`bg-purple-500 text-white px-4 py-2 rounded ${
            isUpdating || isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isUpdating || isLoading}
        >
          {isUpdating ? "Updating..." : "Update"}
        </button>
        {(isUpdating || isLoading) && (
          <div className="ml-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-500"></div>
          </div>
        )}
      </div>
      {updateMessage && (
        <div
          className={`mt-2 p-2 rounded ${
            updateMessage.type === "success"
              ? "bg-green-100 text-green-700"
              : updateMessage.type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {updateMessage.text}
        </div>
      )}
    </div>
  );
};
export default DigitalizeDataSheet;
