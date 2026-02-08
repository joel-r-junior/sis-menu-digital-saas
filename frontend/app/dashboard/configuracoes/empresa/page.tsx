'use client';

import { useState, useEffect, useRef } from 'react';
import { Save, Building2, MapPin, FileText, Camera, Upload } from 'lucide-react';

export default function DadosEmpresaPage() {
    const [loading, setLoading] = useState(false);
    const [msg, setMsg] = useState({ type: '', text: '' });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Estado para armazenar o arquivo selecionado
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    // Estado para mostrar o preview da imagem
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        nome_empresa: '',
        razao_social: '',
        cnpj: '',
        inscricao_estadual: '',
        inscricao_municipal: '',
        regime_tributario: '',
        telefone_principal: '',
        email_principal: '',
        cep: '',
        endereco: '',
        bairro: '',
        nome_responsavel: '',
        cpf_responsavel: ''
    });

    // 1. Carregar dados
    useEffect(() => {
        async function fetchEmpresa() {
            const token = localStorage.getItem('token');
            try {
                const res = await fetch('http://127.0.0.1:8081/api/empresa', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (res.ok) {
                    const data = await res.json();
                    setFormData({
                        nome_empresa: data.nome_empresa || '',
                        razao_social: data.razao_social || '',
                        cnpj: data.cnpj || '',
                        inscricao_estadual: data.inscricao_estadual || '',
                        inscricao_municipal: data.inscricao_municipal || '',
                        regime_tributario: data.regime_tributario || '',
                        telefone_principal: data.telefone_principal || '',
                        email_principal: data.email_principal || '',
                        cep: data.cep || '',
                        endereco: data.endereco || '',
                        bairro: data.bairro || '',
                        nome_responsavel: data.nome_responsavel || '',
                        cpf_responsavel: data.cpf_responsavel || ''
                    });

                    // Se já tiver logo salva no banco, mostra ela
                    if (data.logo_path) {
                        // Ajuste aqui se sua URL base for diferente
                        setPreviewUrl(`http://127.0.0.1:8081${data.logo_path}`);
                    }
                }
            } catch (error) {
                console.error("Erro ao buscar dados");
            }
        }
        fetchEmpresa();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // 2. Manipular a seleção do Arquivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    // 3. Enviar
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMsg({ type: '', text: '' });

        const token = localStorage.getItem('token');
        const dataToSend = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            dataToSend.append(key, value);
        });

        if (selectedFile) {
            dataToSend.append('logo', selectedFile);
        }

        try {
            const res = await fetch('http://127.0.0.1:8081/api/empresa', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: dataToSend
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

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Building2 className="text-blue-600" /> Dados da Empresa
                </h1>
                <p className="text-gray-500">Gerencie a identidade visual e dados do seu negócio.</p>
            </div>

            {msg.text && (
                <div className={`p-4 mb-4 rounded-lg ${msg.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* === ÁREA DE UPLOAD DA LOGO === */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-8">
                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>

                        {/* Círculo da Imagem */}
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-inner bg-white flex items-center justify-center relative">

                            {/* 1. A Imagem ou o Ícone */}
                            {previewUrl ? (
                                <img src={previewUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Camera size={40} className="text-gray-300" />
                            )}

                            {/* 2. O Overlay (Camada de Efeito) */}
                            {/* Mudamos para: Fundo preto fixo (bg-black/50), mas invisível (opacity-0) até passar o mouse */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <Upload className="text-white" />
                            </div>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <h3 className="font-semibold text-gray-700">Logo principal</h3>
                        <p className="text-sm text-gray-500 mb-3">Essa imagem aparecerá no topo do seu menu digital.</p>
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm text-blue-600 font-medium hover:text-blue-800 border border-blue-200 px-4 py-2 rounded-lg hover:bg-blue-50 transition"
                        >
                            Escolher Imagem
                        </button>
                        <p className="text-xs text-gray-400 mt-2">Recomendado: 500x500px (JPG, PNG)</p>
                    </div>
                </div>

                {/* === INFORMAÇÕES BÁSICAS === */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                        <FileText size={20} /> Informações Básicas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome Fantasia (Nome do Estabelecimento)*</label>
                            <input
                                type="text" name="nome_empresa" required
                                value={formData.nome_empresa} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Razão Social</label>
                            <input
                                type="text" name="razao_social"
                                value={formData.razao_social} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
                            <input
                                type="text" name="cnpj" placeholder="00.000.000/0000-00"
                                value={formData.cnpj} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Regime Tributário</label>
                            <select
                                name="regime_tributario"
                                value={formData.regime_tributario} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-800"
                            >
                                <option value="">Selecione...</option>
                                <option value="Simples Nacional">Simples Nacional</option>
                                <option value="Lucro Presumido">Lucro Presumido</option>
                                <option value="Lucro Real">Lucro Real</option>
                                <option value="Isento">Isento</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Inscrição Estadual</label>
                            <input
                                type="text" name="inscricao_estadual"
                                value={formData.inscricao_estadual} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Inscrição Municipal</label>
                            <input
                                type="text" name="inscricao_municipal"
                                value={formData.inscricao_municipal} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável</label>
                            <input
                                type="text" name="nome_responsavel"
                                value={formData.nome_responsavel} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CPF do Responsável</label>
                            <input
                                type="text" name="cpf_responsavel"
                                value={formData.cpf_responsavel} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                    </div>
                </div>

                {/* === ENDEREÇO E CONTATO === */}
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
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Comercial</label>
                            <input
                                type="email" name="email_principal"
                                value={formData.email_principal} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                            <input
                                type="text" name="endereco" placeholder="Rua, Número, Complemento"
                                value={formData.endereco} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                            <input
                                type="text" name="bairro"
                                value={formData.bairro} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                            <input
                                type="text" name="cep"
                                value={formData.cep} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                    </div>
                </div>

                {/* === DADOS FINANCEIROS === */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center gap-2">
                        <MapPin size={20} /> Dados Financeiros
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                            <input
                                type="text" name="telefone_principal"
                                value={formData.telefone_principal} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Comercial</label>
                            <input
                                type="email" name="email_principal"
                                value={formData.email_principal} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                            <input
                                type="text" name="endereco" placeholder="Rua, Número, Complemento"
                                value={formData.endereco} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                            <input
                                type="text" name="bairro"
                                value={formData.bairro} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                            <input
                                type="text" name="cep"
                                value={formData.cep} onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
                            />
                        </div>
                    </div>
                </div>

                {/* === Botão Salvar === */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all disabled:opacity-50"
                    >
                        <Save size={20} />
                        {loading ? 'Enviando...' : 'Salvar Tudo'}
                    </button>
                </div>

            </form>
        </div>
    );
}