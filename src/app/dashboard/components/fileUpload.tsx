import React, { useRef, useState } from "react";
import { storage } from "@/app/firebase/config";
import { ref, uploadBytes } from "firebase/storage";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uid: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, uid }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileUpload = (file: File) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onFileUpload(file);
    } else {
      alert("Only PDF files are supported.");
    }
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      const userFolderRef = ref(storage, `users/${uid}`);
      const fileRef = ref(userFolderRef, selectedFile.name);

      uploadBytes(fileRef, selectedFile).then(() => {
        alert("PDF file uploaded successfully.");
        setSelectedFile(null);
      });
    } else {
      alert("Please select a file.");
    }
  };

  return (
    <div>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {selectedFile ? (
          <img
            src="/pdfLogo.png"
            alt="PDF Logo"
            className="h-15 w-12 mx-auto mb-2"
          />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-2 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        )}
        {selectedFile ? (
          <p className="text-gray-600">{selectedFile.name}</p>
        ) : (
          <p className="text-gray-600">Drag and drop a file</p>
        )}
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      {selectedFile && (
        <div className="flex justify-center">
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleUploadClick}
          >
            Upload PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
