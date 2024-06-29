import React from "react";

interface TableContentProps {
  uid: string;
}

const TableContent: React.FC<TableContentProps> = ({ uid }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Table Page</h1>
      <p className="text-xl text-gray-600">Under Development</p>
      <p className="text-lg text-gray-500 mt-4">User ID: {uid}</p>
    </div>
  );
};

export default TableContent;
