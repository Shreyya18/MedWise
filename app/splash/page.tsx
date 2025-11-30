export default function Splash() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-500 to-green-400 text-white">
      <img src="/assets/icon.png" alt="MedWise Logo" className="w-32 h-32 mb-6" />

      <h1 className="text-4xl font-bold mb-2">MedWise</h1>
      <p className="text-lg opacity-90">Smarter decisions for safer health.</p>
    </div>
  );
}
