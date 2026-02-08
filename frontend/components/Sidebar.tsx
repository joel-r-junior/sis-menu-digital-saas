'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Package, List, Settings, LogOut, 
  ChevronDown, ChevronRight, Building2, Users, X 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;        // Controla se está visível no mobile
  closeMobile: () => void; // Função para fechar no mobile
}

export default function Sidebar({ isOpen, closeMobile }: SidebarProps) {
  const pathname = usePathname();
  
  // Estado local para controlar apenas o Dropdown de Configurações
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Função auxiliar para estilizar links ativos
  const isActive = (path: string) => pathname === path 
    ? 'bg-blue-600 text-white shadow-md' 
    : 'text-gray-300 hover:bg-slate-800 hover:text-white';

  return (
    <>
      {/* --- MOBILE OVERLAY (Fundo escuro apenas no celular) --- */}
      <div 
        className={`fixed inset-0 z-20 bg-black/50 transition-opacity md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeMobile}
      />

      {/* --- ASIDE PRINCIPAL --- */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-900 text-white 
          transform transition-transform duration-300 ease-in-out flex flex-col h-full
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
        `}
      >
        {/* Cabeçalho do Menu */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-700">
          <span className="font-bold text-xl">
            SisMenu<span className="text-blue-500">Digital</span>
          </span>
          <button onClick={closeMobile} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Links de Navegação */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          
          <Link href="/dashboard" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive('/dashboard')}`}>
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <Link href="/dashboard/produtos" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive('/dashboard/produtos')}`}>
            <Package size={20} />
            <span className="font-medium">Produtos</span>
          </Link>

          <Link href="/dashboard/categorias" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${isActive('/dashboard/categorias')}`}>
            <List size={20} />
            <span className="font-medium">Categorias</span>
          </Link>

          {/* === DROPDOWN CONFIGURAÇÕES === */}
          <div className="pt-2">
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="w-full flex items-center justify-between px-3 py-3 text-gray-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Settings size={20} />
                <span className="font-medium">Configurações</span>
              </div>
              {isConfigOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>

            {/* Sub-itens com animação simples */}
            {isConfigOpen && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-700 pl-2">
                <Link href="/dashboard/configuracoes/empresa" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive('/dashboard/configuracoes/empresa')}`}>
                  <Building2 size={18} />
                  Minha Empresa
                </Link>
                <Link href="/dashboard/configuracoes/usuarios" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${isActive('/dashboard/configuracoes/usuarios')}`}>
                  <Users size={18} />
                  Usuários
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Rodapé (Logout) */}
        <div className="p-4 border-t border-slate-700">
          <button 
            onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }}
            className="flex items-center gap-3 text-gray-400 hover:text-red-400 w-full px-3 py-2 transition-colors"
          >
            <LogOut size={20} />
            Sair do Sistema
          </button>
        </div>
      </aside>
    </>
  );
}