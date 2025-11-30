"use client";

import { useEffect, useState } from "react";

export default function AnalysisPage() {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState("Analyzing image...");
  const [result, setResult] = useState<any>(null);

  // Get image from previous page
  useEffect(() => {
    const img = sessionStorage.getItem("scanned-image");
    if (!img) {
      setStatus("No image found. Please scan again.");
      return;
    }
    setImage(img);

    // Future: Model inference will go here
    setStatus("Preparing model...");
    setTimeout(() => {
      setStatus("Model not connected yet. Train your model first.");
    }, 1500);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-6">

      <h1 className="text-3xl font-bold mb-4">Analysis</h1>

      {image && (
        <img
          src={image}
          alt="Scanned"
          className="w-72 rounded-xl shadow-lg mb-4"
        />
      )}

      <div className="p-4 bg-gray-100 rounded-lg w-full max-w-sm text-center">
        <p className="text-lg">{status}</p>
      </div>

      {result && (
        <div className="mt-6 p-4 bg-white shadow rounded-lg w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-2">Result</h2>
          <p><strong>Name:</strong> {result.name}</p>
          <p><strong>Confidence:</strong> {result.confidence}</p>
        </div>
      )}
    </div>
  );
}
