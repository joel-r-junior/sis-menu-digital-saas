'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar'; // Arquivo do menu lateral
import { Menu, Search, Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Usuário');

  // Verifica Autenticação
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStored = localStorage.getItem('user');

    if (!token) {
      router.push('/login');
    }

    if (userStored) {
      try {
        const user = JSON.parse(userStored);
        setUserName(user.name);
      } catch (e) {
        console.error("Erro ao ler usuário", e);
      }
    }
  }, [router]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      
      {/* 1. O SIDEBAR */}
      <Sidebar 
        isOpen={mobileMenuOpen} 
        closeMobile={() => setMobileMenuOpen(false)} 
      />

      {/* 2. ÁREA DE CONTEÚDO */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER (Topo) */}
        <header className="h-16 bg-white shadow-sm border-b flex items-center justify-between px-4 md:px-8 z-10">
          
          <div className="flex items-center gap-4">
            {/* Botão responsivo (Só aparece no Mobile) */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>

            {/* Barra de Busca (Desktop) */}
            <div className="hidden md:flex relative text-gray-400 focus-within:text-gray-600">
              <Search className="absolute left-3 top-2.5" size={18} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500 w-64 transition-all"
              />
            </div>
          </div>

          {/* Área do Usuário */}
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-blue-600">
              <Bell size={20} />
              <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-gray-700">{userName}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}