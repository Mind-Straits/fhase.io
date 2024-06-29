import React, { useRef, useState } from "react";
import { storage } from "@/app/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";

interface FileUploadProps {
  uid: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ uid }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const handleFileUpload = (files: File[]) => {
    const pdfFiles = files.filter((file) => file.type === "application/pdf");
    if (pdfFiles.length > 0) {
      setSelectedFiles(pdfFiles);
    } else {
      alert("Only PDF files are supported.");
    }
  };
  const handleUploadClick = () => {
    if (selectedFiles.length > 0) {
      setIsUploading(true);
      const uploadTasks = selectedFiles.map((file) => {
        const userFolderRef = ref(storage, `${uid}/pdf`);
        const fileRef = ref(userFolderRef, file.name);
        return uploadBytesResumable(fileRef, file);
      });
  
      const totalFiles = uploadTasks.length;
      let completedFiles = 0;
  
      uploadTasks.forEach((uploadTask, index) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setUploadProgress((prevProgresses) => {
              const newProgresses = [...prevProgresses];
              newProgresses[index] = progress;
              return newProgresses;
            });
          },
          (error) => {
            console.error(
              `Error uploading file ${selectedFiles[index].name}:`,
              error
            );
          },
          () => {
            completedFiles++;
            if (completedFiles === totalFiles) {
              // Check if all progress bars are at 100%
              const allComplete = uploadProgress.every((progress) => progress === 100);
              if (allComplete) {
                setIsUploading(false);
                setSelectedFiles([]);
                setUploadProgress([]);
                alert("All files uploaded successfully!");
              }
            }
          }
        );
      });
    } else {
      alert("Please select at least one file.");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {selectedFiles.length > 0 ? (
          <Image
            src="/pdfLogo.png"
            alt="PDF Logo"
            width={48}
            height={60}
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
        {selectedFiles.length > 0 ? (
          <p className="text-gray-600">
            {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}{" "}
            selected
          </p>
        ) : (
          <p className="text-gray-600">Drag and drop files here</p>
        )}
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          multiple
        />
      </div>
      {selectedFiles.length > 0 && !isUploading && (
        <div className="flex justify-center">
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={handleUploadClick}
          >
            Upload PDFs
          </button>
        </div>
      )}
      {selectedFiles.length > 0 && (
        <div className="mt-4 w-full max-w-md mx-auto">
          {selectedFiles.map((file, index) => (
            <div key={file.name} className="mb-4 text-center">
              <p className="text-gray-600">
                {file.name} {isUploading && `(${uploadProgress[index] || 0}%)`}
              </p>
              {isUploading && (
                <div className="w-64 h-2 bg-gray-300 rounded-full mx-auto">
                  <div
                    className="h-2 bg-blue-500 rounded-full"
                    style={{ width: `${uploadProgress[index] || 0}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
