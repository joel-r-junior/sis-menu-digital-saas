# 🍔 SisMenu Digital - SaaS para Gestão de Restaurantes

Sistema completo de gestão para pequenos restaurantes, permitindo cadastro de cardápio, geração de QR Code e recebimento de pedidos em tempo real.

![Status do Projeto](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)

## 🚀 Tecnologias Utilizadas

### Backend (API)
* **Laravel 12** (API Restful)
* **PostgreSQL** (Banco de Dados)
* **Sanctum** (Autenticação Segura)
* **Multi-tenancy** (Estrutura para múltiplos clientes/inquilinos)

### Frontend (Client)
* **Next.js 14** (App Router)
* **TypeScript**
* **Tailwind CSS** (Estilização)
* **Lucide React** (Ícones)

## ✨ Funcionalidades Principais (MVP)

- [x] Autenticação de Usuários e Gestão de Sessão.
- [x] Cadastro de Empresa e Dados Fiscais.
- [x] Gestão de Categorias e Produtos.
- [x] Upload de Imagens.
- [ ] Geração de Cardápio Digital via QR Code (Em breve).
- [ ] KDS (Kitchen Display System) em Tempo Real (Em breve).

## 📸 Screenshots
(Em breve)

## 🔧 Como Rodar o Projeto

### Pré-requisitos
* PHP 8.2+
* Node.js 18+
* PostgreSQL
* Composer

### Passo a passo
1. Clone o repositório.
2. Configure o `.env` no backend.
3. Rode `composer install` e `php artisan migrate --seed`.
4. No frontend, rode `npm install` e `npm run dev`.

---
Desenvolvido por **[Seu Nome]** para fins de estudo e portfólio.
