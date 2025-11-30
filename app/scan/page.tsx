"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FaCamera, FaUpload } from "react-icons/fa";

export default function ScanPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [image, setImage] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);

  // Turn ON camera
  const startCamera = async () => {
    setCameraOn(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" } // back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert("Camera access denied!");
    }
  };

  // Capture image from camera
  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setImage(dataUrl);

    // Stop camera
    stopCamera();
  };

  // Stop camera stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraOn(false);
  };

  // Upload image from file
  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6">

      <h1 className="text-3xl font-bold mb-4">Scan Medicine</h1>

      {/* CAMERA SECTION */}
      {!image && (
        <div className="flex flex-col items-center">

          {!cameraOn && (
            <button
              onClick={startCamera}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg mb-4"
            >
              <FaCamera /> Open Camera
            </button>
          )}

          {cameraOn && (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-72 h-72 bg-black rounded-lg mb-4"
              />

              <button
                onClick={captureImage}
                className="px-6 py-3 bg-green-600 text-white rounded-lg"
              >
                Capture Photo
              </button>

              <button
                onClick={stopCamera}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Stop Camera
              </button>
            </>
          )}
        </div>
      )}

      {/* UPLOAD OPTION */}
      {!image && (
        <label className="mt-6 flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg cursor-pointer">
          <FaUpload /> Upload from Gallery
          <input type="file" accept="image/*" className="hidden" onChange={uploadImage} />
        </label>
      )}

      {/* PREVIEW SECTION */}
      {image && (
        <div className="mt-6 flex flex-col items-center">
          <img
            src={image}
            alt="Captured"
            className="w-72 rounded-xl shadow-lg mb-4"
          />

          <button
  onClick={() => {
    sessionStorage.setItem("scanned-image", image!);
    router.push("/analysis");
  }}
  className="px-6 py-3 bg-blue-700 text-white rounded-lg"
>
  Analyze Image
</button>


          <button
            onClick={() => setImage(null)}
            className="mt-3 px-4 py-2 bg-gray-500 text-white rounded-lg"
          >
            Retake / Re-upload
          </button>
        </div>
      )}

      <canvas ref={canvasRef} className="hidden"></canvas>
    </div>
  );
}
