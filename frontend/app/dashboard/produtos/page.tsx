'use client';

import { useState, useEffect } from 'react';
import { Save, Building2, MapPin, Phone, FileText } from 'lucide-react';

export default function DadosEmpresaPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  
  // Estado inicial do formulário
  const [formData, setFormData] = useState({
    nome_empresa: '',
    razao_social: '',
    cnpj: '',
    inscricao_estadual: '',
    regime_tributario: '',
    telefone_principal: '',
    email_principal: '',
    cep: '',
    endereco: '',
    bairro: '',
    nome_responsavel: ''
  });

  // 1. Carregar dados existentes ao abrir a página
  useEffect(() => {
    async function fetchEmpresa() {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://127.0.0.1:8081/api/empresa', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Preenche o form com o que veio do banco
          setFormData({
            nome_empresa: data.nome_empresa || '',
            razao_social: data.razao_social || '',
            cnpj: data.cnpj || '',
            inscricao_estadual: data.inscricao_estadual || '',
            regime_tributario: data.regime_tributario || '',
            telefone_principal: data.telefone_principal || '',
            email_principal: data.email_principal || '',
            cep: data.cep || '',
            endereco: data.endereco || '',
            bairro: data.bairro || '',
            nome_responsavel: data.nome_responsavel || ''
          });
        }
      } catch (error) {
        console.error("Erro ao buscar dados da empresa");
      }
    }
    fetchEmpresa();
  }, []);

  // 2. Manipular mudanças nos inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Enviar dados para salvar
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://127.0.0.1:8081/api/empresa', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erro ao salvar');

      setMsg({ type: 'success', text: 'Dados atualizados com sucesso!' });
    } catch (error: any) {
      setMsg({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="text-blue-600" /> Produtos
        </h1>
        <p className="text-gray-500">Mantenha os dados do seu estabelecimento atualizados.</p>
      </div>

      {/* Mensagens de Feedback */}
      {msg.text && (
        <div className={`p-4 mb-4 rounded-lg ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Seção 1: Identificação */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                <FileText size={20} /> Informações Básicas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia (Nome do Restaurante)*</label>
                    <input 
                        type="text" name="nome_empresa" required
                        value={formData.nome_empresa} onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                    <input 
                        type="text" name="razao_social"
                        value={formData.razao_social} onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                    <input 
                        type="text" name="cnpj" placeholder="00.000.000/0000-00"
                        value={formData.cnpj} onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Regime Tributário</label>
                    <select 
                        name="regime_tributario"
                        value={formData.regime_tributario} onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                        <option value="">Selecione...</option>
                        <option value="Simples Nacional">Simples Nacional</option>
                        <option value="Lucro Presumido">Lucro Presumido</option>
                        <option value="Lucro Real">Lucro Real</option>
                        <option value="Isento">Isento</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Seção 2: Contato e Endereço */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                <MapPin size={20} /> Endereço e Contato
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                    <input 
                        type="text" name="telefone_principal"
                        value={formData.telefone_principal} onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Comercial</label>
                    <input 
                        type="email" name="email_principal"
                        value={formData.email_principal} onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                    <input 
                        type="text" name="endereco" placeholder="Rua, Número, Complemento"
                        value={formData.endereco} onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                    <input 
                        type="text" name="bairro"
                        value={formData.bairro} onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                    <input 
                        type="text" name="cep"
                        value={formData.cep} onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
            </div>
        </div>

        {/* Botão Salvar */}
        <div className="flex justify-end">
            <button 
                type="submit" 
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all disabled:opacity-50"
            >
                <Save size={20} />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
            </button>
        </div>

      </form>
    </div>
  );
}