'use client';

import { useState, useEffect } from 'react';
import { Save, List, Plus, Trash2, Edit2, X, AlertCircle } from 'lucide-react';

// Tipagem dos dados (TypeScript)
interface Categoria {
  id: number;
  nome_categoria: string;
  padrao: 'padrao' | 'personalizada';
  ativo: boolean;
}

export default function CategoriasPage() {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Estado para controlar se estamos EDITANDO ou CRIANDO
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome_categoria: '',
    padrao: 'personalizada'
  });

  // 1. Carregar categorias ao abrir
  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://127.0.0.1:8081/api/categorias', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setCategorias(data);
    } catch (error) {
      console.error("Erro ao buscar categorias");
    }
  }

  // 2. Preparar formulário para NOVA categoria
  const handleNew = () => {
    setMsg({ type: '', text: '' });
    setFormData({ nome_categoria: '', padrao: 'personalizada' });
    setIsEditing(true);
    setCurrentId(null);
  };

  // 3. Preparar formulário para EDITAR categoria
  const handleEdit = (cat: Categoria) => {
    setMsg({ type: '', text: '' });
    setFormData({ nome_categoria: cat.nome_categoria, padrao: cat.padrao });
    setIsEditing(true);
    setCurrentId(cat.id);
  };

  // 4. Cancelar ação
  const handleCancel = () => {
    setIsEditing(false);
    setMsg({ type: '', text: '' });
  };

  // 5. Excluir categoria
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://127.0.0.1:8081/api/categorias/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchCategorias(); // Recarrega a lista
        setMsg({ type: 'success', text: 'Categoria excluída com sucesso!' });
      } else {
        throw new Error();
      }
    } catch (error) {
      setMsg({ type: 'error', text: 'Erro ao excluir categoria.' });
    }
  };

  // 6. Salvar (Criar ou Atualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });
    
    const token = localStorage.getItem('token');
    const url = currentId 
      ? `http://127.0.0.1:8081/api/categorias/${currentId}` // PUT (Editar)
      : 'http://127.0.0.1:8081/api/categorias';            // POST (Criar)
    
    const method = currentId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Erro ao salvar');

      setMsg({ type: 'success', text: 'Categoria salva com sucesso!' });
      setIsEditing(false); // Fecha o formulário
      fetchCategorias();   // Atualiza a lista
    } catch (error: any) {
      setMsg({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* Cabeçalho */}
      <div className="mb-6 flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <List className="text-blue-600" /> Gerenciar Categorias
            </h1>
            <p className="text-gray-500">Organize os itens do seu cardápio.</p>
        </div>
        
        {/* Botão Nova Categoria (Só aparece se não estiver editando) */}
        {!isEditing && (
            <button 
                onClick={handleNew}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-all"
            >
                <Plus size={20} /> Nova Categoria
            </button>
        )}
      </div>

      {/* Mensagens de Feedback */}
      {msg.text && (
        <div className={`p-4 mb-4 rounded-lg flex items-center gap-2 ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            <AlertCircle size={20} />
            {msg.text}
        </div>
      )}

      {/* === MODO FORMULÁRIO (Criação/Edição) === */}
      {isEditing ? (
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-fade-in">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center justify-between">
                {currentId ? 'Editar Categoria' : 'Nova Categoria'}
                <button onClick={handleCancel} className="text-gray-400 hover:text-red-500"><X size={20}/></button>
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Categoria</label>
                    <input 
                        type="text" 
                        required
                        value={formData.nome_categoria} 
                        onChange={(e) => setFormData({...formData, nome_categoria: e.target.value})}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Ex: Lanches, Bebidas, Promoções"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <button 
                        type="button" 
                        onClick={handleCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow transition-all disabled:opacity-50"
                    >
                        <Save size={20} />
                        {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
         </div>
      ) : (
        /* === MODO LISTAGEM (Tabela) === */
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {categorias.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    <List size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>Nenhuma categoria cadastrada.</p>
                </div>
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                            <th className="p-4 font-semibold border-b">Nome</th>
                            <th className="p-4 font-semibold border-b text-center w-32">Tipo</th>
                            <th className="p-4 font-semibold border-b text-right w-40">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categorias.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-medium text-gray-800">{cat.nome_categoria}</td>
                                <td className="p-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        cat.padrao === 'padrao' 
                                        ? 'bg-blue-100 text-blue-700' 
                                        : 'bg-purple-100 text-purple-700'
                                    }`}>
                                        {cat.padrao === 'padrao' ? 'Sistema' : 'Personalizada'}
                                    </span>
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    {/* Só permite editar/excluir se for personalizada ou se você quiser permitir tudo */}
                                    <button 
                                        onClick={() => handleEdit(cat)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(cat.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      )}
    </div>
  );
}