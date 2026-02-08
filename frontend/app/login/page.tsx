'use client'; // Obrigatório para usar estados (useState) no Next.js

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Aqui apontamos para o seu backend na porta 8081
      const res = await fetch('http://127.0.0.1:8081/api/login', { 
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
        },
        body: JSON.stringify({ 
            email, 
            password, 
            device_name: 'navegador-web' 
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Falha ao tentar entrar.');
      }

      // SUCESSO!
      // 1. Salva o token no navegador
      localStorage.setItem('token', data.token);

      // 2. Salva os dados do usuário (opcional, útil para mostrar o nome depois)
      localStorage.setItem('user', JSON.stringify(data.user));

      // 3. Redireciona para dashboard
      alert('Login realizado com sucesso! ');
      router.push('/dashboard'); 

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md border border-gray-200">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Bem-vindo</h2>
            <p className="mt-2 text-sm text-gray-600">Entre com sua conta de teste</p>
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 border-l-4 border-red-500 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-black"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Processando...' : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}