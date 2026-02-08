import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <h1 className="text-4xl font-bold mb-8 text-blue-600">Sis MenuDigital</h1>
      <p className="mb-8 text-lg text-gray-600">Sistema de Cardápio com Laravel e Next.js</p>

      <Link 
        href="/login" 
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Ir para Login
      </Link>
    </main>
  );
}