'use client';

import { useEffect, useState } from 'react';
import { Package, List, TrendingUp, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    categorias: 0,
    produtos: 0, // Placeholder por enquanto
    visualizacoes: 1250 // Fake data para bonito
  });

  useEffect(() => {
    // Buscar contagem real de categorias
    async function fetchStats() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://127.0.0.1:8081/api/categorias', {
           headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(prev => ({ ...prev, categorias: data.length }));
        }
      } catch (error) {
        console.error("Erro ao carregar stats");
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Título da Página */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Visão Geral</h1>
          <p className="text-gray-500">Bem-vindo de volta ao seu painel administrativo.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm">
          + Novo Pedido
        </button>
      </div>

      {/* Grid de Cards (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Vendas" 
          value="R$ 1.240,00" 
          change="+12%" 
          icon={<DollarSign size={24} className="text-green-600" />} 
          color="bg-green-100"
        />
        <StatCard 
          title="Categorias Ativas" 
          value={stats.categorias} 
          change="Atualizado agora" 
          icon={<List size={24} className="text-blue-600" />} 
          color="bg-blue-100"
        />
        <StatCard 
          title="Produtos Cadastrados" 
          value={stats.produtos} 
          change="Em breve" 
          icon={<Package size={24} className="text-orange-600" />} 
          color="bg-orange-100"
        />
        <StatCard 
          title="Visualizações do Menu" 
          value={stats.visualizacoes} 
          change="+5% hoje" 
          icon={<TrendingUp size={24} className="text-purple-600" />} 
          color="bg-purple-100"
        />
      </div>

      {/* Exemplo de Seção de Conteúdo (Tabela Recente) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Atalhos Rápidos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="p-4 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition">
                <span className="font-medium">Cadastrar Produto</span>
             </div>
             <div className="p-4 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition">
                <span className="font-medium">Editar Cardápio</span>
             </div>
             <div className="p-4 border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition">
                <span className="font-medium">Gerar QR Code</span>
             </div>
        </div>
      </div>

    </div>
  );
}

// Componente de Card Reutilizável
function StatCard({ title, value, change, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        <p className="text-xs font-medium text-green-600 mt-2">{change}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  );
}