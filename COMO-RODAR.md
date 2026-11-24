# Como rodar o projeto

Escolha **um** dos dois jeitos:

- **[A) Codespace](#a-codespace)**: qualquer computador, só com o navegador (bom para o PC da faculdade).
- **[B) Windows ou Linux](#b-windows-ou-linux-no-seu-computador)**: no seu computador, com o VS Code.

Depois de rodar, veja **[O que testar](#o-que-testar)**.
Cada bloco é um comando: copie, cole no terminal e aperte Enter.

No Expo Go do celular, entre com a sua conta do Expo (a mesma do token `EXPO_TOKEN` abaixo).
Troque `COLE-SEU-TOKEN-DO-EXPO` pelo seu token (crie em https://expo.dev/settings/access-tokens).

---

# A) Codespace

## A.1 Preparar (faça ANTES do dia, uma vez só)

1. Abra o seu repositório no GitHub > botão verde **Code** > aba **Codespaces** > **Create codespace on main**.
2. Abra um terminal (menu ☰ > Terminal > New Terminal) e rode:

```
cd backend
```
```
cp .env.example .env
```
```
npm install
```
```
npx prisma migrate deploy
```
```
npx prisma generate
```
```
npm run dados-exemplo
```
```
cd ../mobile
```
```
npm install
```
```
cd ../frontend
```
```
npm install
```

O Codespace fica salvo. No dia é só abrir o mesmo em https://github.com/codespaces.

## A.2 No dia da apresentação

### Terminal 1: backend

```
cd /workspaces/projeto-tecnologia-e-contrucao-de-software-2/backend
```
```
npm run start:dev
```

Espere aparecer `Application is running on: http://localhost:3000/api`.

### Deixar a porta 3000 pública (para o celular)

1. Aba **Ports** (embaixo, ao lado do Terminal).
2. Na porta **3000**: botão direito > **Port Visibility** > **Public**.
3. Copie o endereço da coluna "Forwarded Address" (ex.: `https://nome-estranho-3000.app.github.dev`).

### Terminal 2: app (clique no + do terminal)

```
cd /workspaces/projeto-tecnologia-e-contrucao-de-software-2/mobile
```
```
export EXPO_TOKEN="COLE-SEU-TOKEN-DO-EXPO"
```
Troque pelo endereço copiado da aba Ports (sem barra no final):
```
export EXPO_PUBLIC_API_URL="https://COLE-O-ENDERECO-3000.app.github.dev"
```
```
npx expo start --tunnel ngrok
```

Leia o QR Code com a câmera do iPhone e abra no Expo Go.

### Terminal 3: site

```
cd /workspaces/projeto-tecnologia-e-contrucao-de-software-2/frontend
```
```
npm run dev
```

Aba **Ports** > porta **5173** > ícone de globo (**Open in Browser**).
O site já fala com o backend sozinho (a 5173 não precisa ser pública).

### Terminal 4: Prisma Studio (ver as tabelas do banco)

```
cd /workspaces/projeto-tecnologia-e-contrucao-de-software-2/backend
```
```
npx prisma studio
```

Aba **Ports** > porta **5555** > ícone de globo (**Open in Browser**).

---

# B) Windows ou Linux (no seu computador)

Precisa do **Node.js** instalado (https://nodejs.org, versão LTS).
Abra a pasta do projeto no **VS Code** e use o terminal dele (menu Terminal > New Terminal).

Onde houver dois comandos, use o do seu sistema: **Windows** = PowerShell, **Linux** = bash.

## B.1 Só uma vez (só no Windows)

```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

## B.2 Terminal 1: backend

```
cd backend
```
Crie o arquivo `.env` (só na primeira vez). Windows:
```
Copy-Item .env.example .env
```
Linux:
```
cp .env.example .env
```
```
npm install
```
```
npx prisma migrate deploy
```
```
npx prisma generate
```
```
npm run dados-exemplo
```
```
npm run start:dev
```

Espere aparecer `Application is running on: http://localhost:3000/api` e deixe aberto.

## B.3 Deixar a porta 3000 pública (para o celular)

1. No painel de baixo do VS Code, aba **Ports** > **Forward a Port** > digite `3000`
   (pede login no GitHub na primeira vez).
2. Botão direito na porta 3000 > **Port Visibility** > **Public**.
3. Copie o endereço da coluna "Forwarded Address" (ex.: `https://xxxx-3000.brs.devtunnels.ms`).

## B.4 Terminal 2: app (clique no + do terminal)

```
cd mobile
```
```
npm install
```

Windows:
```
$env:EXPO_TOKEN="COLE-SEU-TOKEN-DO-EXPO"
```
```
$env:EXPO_PUBLIC_API_URL="https://COLE-O-ENDERECO-3000.brs.devtunnels.ms"
```

Linux:
```
export EXPO_TOKEN="COLE-SEU-TOKEN-DO-EXPO"
```
```
export EXPO_PUBLIC_API_URL="https://COLE-O-ENDERECO-3000.brs.devtunnels.ms"
```

(troque pelo endereço copiado da aba Ports, sem barra no final)

```
npx expo start --tunnel ngrok
```

Leia o QR Code com a câmera do iPhone e abra no Expo Go.

## B.5 Terminal 3: site

```
cd frontend
```
```
npm install
```
```
npm run dev
```

Abra no navegador: http://localhost:5173

## B.6 Terminal 4: Prisma Studio (ver as tabelas do banco)

```
cd backend
```
```
npx prisma studio
```

Abre sozinho no navegador. Se não abrir: http://localhost:5555

---

# O que testar

## No app

1. **Cadastre-se**: crie um aluno (nome, e-mail, senha de 6+ letras). O app já entra sozinho.
2. **Início**: aparece "Olá, seu nome!". Alterne entre **Cursos** e **Trilhas**.
3. Abra a trilha **Desenvolvedor Full Stack**: os cursos aparecem em ordem (1, 2).
4. Abra o curso **React Native**: as aulas aparecem com **cadeado**.
5. Toque em **Matricular-se**: escolha o plano (**Mensal** ou **Anual**) e a forma de
   pagamento (**Pix**, **Cartão de crédito** ou **Cartão de débito**) > **Pagar**.
6. O app vai para **Meus Cursos** com o curso marcado como **Matriculado**.
7. Abra o curso de novo: as aulas estão **liberadas** e aparece "Você já está matriculado".
8. Aba **Perfil**: seu nome, e em **Avisos** a mensagem "Parabéns! Sua matrícula no curso
   React Native foi confirmada." Botão **Sair da conta** no final.
9. Feche o Expo Go e abra de novo: o login continua salvo.

## No site (o que foi feito no app aparece aqui)

Entre com o **mesmo e-mail e senha** do aluno criado no app. O Início mostra o curso
matriculado e o plano escolhido. Em **Meus estudos** > Matrículas e **Assinatura** > Pagamentos
aparece o que foi feito no app. Para ver todos os alunos: `admin@cursos.com` / `admin123`.

## No Prisma Studio

Abra as tabelas **Matriculas**, **Assinaturas**, **Pagamentos** e **Notificacoes**.
Depois de fazer algo no app, clique em atualizar para ver a linha nova.

---

# Se o professor pedir para começar com o banco vazio

Quem se cadastra pelo app ou pelo site é sempre **aluno**. O admin é criado por comando.

Pare o backend (Ctrl+C no Terminal 1), entre na pasta `backend` e apague o banco:

- Codespace ou Linux: `rm -f prisma/dev.db`
- Windows: `Remove-Item prisma\dev.db`

Depois:
```
npx prisma migrate deploy
```
Crie o seu admin (troque e-mail, senha e nome):
```
npm run admin-inicial -- seuemail@gmail.com suasenha "Seu Nome"
```
```
npm run start:dev
```

Entre no **site** com esse admin e cadastre, nesta ordem: **Categorias** > **Cursos** >
**Módulos** > **Aulas** > **Planos** (sem plano o app não consegue matricular) > **Trilhas** >
**Cursos das trilhas**. Os alunos se cadastram pelo app.

---

# Se der erro

| Erro | O que fazer |
|---|---|
| `npm.ps1 não pode ser carregado` (Windows) | Rode o comando do B.1 |
| `cd: no such file` (Codespace) | Veja o nome da pasta com `ls /workspaces` e use o que aparecer |
| "Não foi possível conectar ao servidor" | Backend ligado? Porta 3000 está **Public**? O `EXPO_PUBLIC_API_URL` está certo (sem barra no final)? |
| Expo Go pede login | Rode de novo a linha do `EXPO_TOKEN` (vale só para aquele terminal) |
| Aviso de "install scripts" no `npm install` | Rode `npm rebuild` dentro da pasta `backend` |
| QR Code cortado | Aumente o painel do terminal ou diminua o zoom (Ctrl -) |
| Não aperte Ctrl+C | Ctrl+C desliga o que está rodando naquele terminal |
