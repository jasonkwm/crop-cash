import React, { useState } from "react";
import { useGlobalState } from "../context/GlobalStateProvider";

interface KYCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}

const KYCModal: React.FC<KYCModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { setKycDone } = useGlobalState();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
      setIsSubmitted(true);
      setKycDone(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setSelectedFile(null);
        onClose();
      }, 2000); // Automatically close modal after 2 seconds
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        {isSubmitted ? (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center bg-green-100 rounded-full">
              <svg
                className="w-8 h-8 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Success!</h3>
            <p className="text-gray-600 text-center">Your ID has been successfully submitted for verification.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-800 mb-4">KYC Verification</h2>
            <p className="text-gray-600 mb-6">Please upload a valid government-issued ID for verification.</p>
            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedFile}
                className={`px-4 py-2 rounded-md text-white ${
                  selectedFile ? "bg-blue-600 hover:bg-blue-500" : "bg-blue-300 cursor-not-allowed"
                }`}
              >
                Submit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default KYCModal;
