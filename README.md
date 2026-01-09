# Task Manager

Aplicação web de gerenciamento de tarefas desenvolvida com Angular, utilizando uma API mock (`db.json`) para persistência de dados durante o desenvolvimento.

---

## ⚙️ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

* **Node.js** 18+ (recomendado LTS)
* **npm** 9+ ou **yarn**
* **Angular CLI** 17+

---

## 🚀 Instalação e Execução

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/joao-chass/task-manager.git
cd task-manager
```

### 2️⃣ Instalar as dependências

```bash
npm install
```

### 3️⃣ Iniciar a aplicação

```bash
npm run start
```

> ⚠️ **Atenção**
> É obrigatório utilizar o comando `npm run start`, pois ele inicia **simultaneamente**:
>
> * A aplicação Angular
> * A API mock baseada no arquivo `db.json`

O script utilizado é:

```json
"start": "concurrently --kill-others \"npm run api\" \"npm run serve\""
```

---

## 🔐 Funcionalidades

### Login (`/login`)

* Formulário de login com validação
* Link para registro de usuário
* Tratamento e exibição de erros

---

### Registro (`/register`)

* Formulário de registro com validação
* Confirmação de senha
* Validação de e-mail único
* Feedback visual ao usuário

---

### Lista de Tarefas (`/tasks`)

* Grid de tarefas responsiva
* Filtros por status
* Busca por texto
* Cards com informações completas das tarefas
* Botões de ação:

  * Editar
  * Excluir
  * Concluir
* Indicadores visuais de status

---

### Nova Tarefa (`/tasks/new`)

* Formulário com validação
* Campos disponíveis:

  * Título
  * Descrição
  * Status
* Botões de ação
* Feedback visual ao usuário

---

### Editar Tarefa (`/tasks/edit/:id`)

* Formulário pré-preenchido com os dados da tarefa
* Mesmas validações da criação
* Atualização em tempo real após edição

---

## 🛠️ Tecnologias Utilizadas

* Angular 17+
* TypeScript
* JSON Server (API mock)
* Concurrently
* HTML5 / CSS3

---

## 🔑 Usuário de Teste

Para facilitar os testes da aplicação, utilize as credenciais abaixo:

* **E-mail:** [teste@email.com](mailto:teste@email.com)
* **Senha:** Teste123

> ℹ️ Esse usuário já está previamente cadastrado no `db.json` e pode ser usado para testar o fluxo de login e funcionalidades do sistema.

---

## 📌 Observações

Este projeto utiliza uma API mock apenas para fins de desenvolvimento e demonstração. Não é recomendado para uso em produção sem a substituição por uma API real.

---

## 📄 Licença

Este projeto está sob a licença MIT.
