# Ruah System

Sistema de gerenciamento educacional desenvolvido com Angular 16, focado no controle de turmas, alunos e pagamentos.

## 🚀 Funcionalidades

- **Autenticação e Autorização**
  - Login e registro de usuários
  - Sistema de autenticação com JWT
  - Proteção de rotas com guards

- **Gestão de Alunos**
  - Cadastro e listagem de alunos
  - Filtros de busca
  - Visualização detalhada

- **Gestão de Turmas**
  - Criação e gerenciamento de turmas
  - Associação de alunos às turmas

- **Gestão Financeira**
  - Controle de pagamentos
  - Registro de transações

## 🛠️ Tecnologias Utilizadas

- **Frontend**
  - Angular 16
  - TypeScript
  - Bootstrap 5
  - Ngx-Mask (para formatação de inputs)
  - Ngx-Toastr (para notificações)
  - Ng-Select (para seleção de itens)
  - Date-fns (para manipulação de datas)

## 📦 Pré-requisitos

- Node.js (versão compatível com Angular 16)
- npm ou yarn
- Angular CLI

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

O aplicativo estará disponível em `http://localhost:4200`

## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── auth/          # Componentes de autenticação
│   ├── core/          # Serviços e interceptors
│   ├── guards/        # Guards de autenticação
│   ├── interfaces/    # Interfaces TypeScript
│   ├── layout/        # Componentes de layout
│   ├── pages/         # Páginas principais
│   ├── pipes/         # Pipes personalizados
│   └── shared/        # Componentes compartilhados
```

## 🔒 Segurança

- Implementação de interceptors para autenticação
- Proteção de rotas com guards
- Validação de formulários
- Sanitização de inputs

## 📝 Licença

Este projeto está sob a licença [INSERIR LICENÇA]

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de enviar pull requests.

## 📞 Suporte

Para suporte, envie um email para [INSERIR EMAIL DE CONTATO]
