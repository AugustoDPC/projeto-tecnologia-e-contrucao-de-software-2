# Ordem de implementação

Passo a passo de **em que ordem** o projeto foi (e deve ser) construído, e **por quê**.
Cada etapa depende da anterior: se pular uma, a seguinte não funciona ou não tem como ser testada.

```
1. Ambiente  →  2. Banco  →  3. Prisma no Nest  →  4. CRUDs  →  5. Usuários e senha
   →  6. Login (JWT)  →  7. Perfis  →  8. Guards globais  →  9. Regra de dono
   →  10. Dono do curso  →  11. Certificado  →  12. Erros em português
   →  13. Frontend (admin, aluno, professor)  →  14. Testes manuais
```

---

## 1. Ambiente

| O quê | Comando / arquivo |
|---|---|
| Projeto NestJS | `nest new backend` |
| Prisma + SQLite | `npm i -D prisma` · `npm i @prisma/client` · `npx prisma init --datasource-provider sqlite` |
| Variáveis | `backend/.env` com `DATABASE_URL="file:./dev.db"` e `JWT_SECRET="..."` |
| Validação | `npm i class-validator class-transformer` |
| Swagger | `npm i @nestjs/swagger` |

**Por que primeiro:** sem banco configurado e sem `.env`, nada do resto sobe.

---

## 2. Modelar o banco (`backend/prisma/schema.prisma`)

As tabelas são criadas **na ordem das dependências**: uma tabela só pode apontar
(chave estrangeira) para outra que já existe.

| Ordem | Tabela | Depende de |
|---|---|---|
| 1 | `Usuario` | — |
| 2 | `Categoria` | — |
| 3 | `Curso` | Usuario (instrutor), Categoria |
| 4 | `Modulo` | Curso |
| 5 | `Aula` | Modulo |
| 6 | `Matricula` | Usuario, Curso |
| 7 | `ProgressoAula` | Usuario, Aula (chave composta) |
| 8 | `Avaliacao` | Usuario, Curso |
| 9 | `Trilha` | Categoria |
| 10 | `TrilhaCurso` | Trilha, Curso (chave composta) |
| 11 | `Certificado` | Usuario, Curso, Trilha |
| 12 | `Plano` | — |
| 13 | `Assinatura` | Usuario, Plano |
| 14 | `Pagamento` | Assinatura |

Depois de cada mudança no schema:

```
npx prisma migrate dev --name descricao_da_mudanca
```

> Para **excluir** é o caminho inverso: não dá para apagar um curso que ainda tem
> módulos, matrículas etc. (a API responde 409 "existem outros registros ligados a este").

---

## 3. Prisma dentro do Nest (`src/prisma/`)

1. `PrismaService` (estende o `PrismaClient`) e `PrismaModule` (exporta o service).
2. No `PrismaService`, `omit: { usuario: { senha: true } }`: o hash da senha **nunca** sai nas respostas.
3. `PrismaExceptionFilter`: transforma erros do banco (e-mail repetido, registro inexistente…) em 400/404/409 legíveis.

**Por que aqui:** todos os services usam o `PrismaService`.

---

## 4. Um CRUD por tabela

Para cada tabela, na mesma ordem da etapa 2:

```
nest g resource nome-da-tabela
```

E preencher:

- **DTO** (`dto/create-*.dto.ts`): o formato dos dados que entram, com `@IsString()`, `@IsInt()`…
- **Service**: as chamadas ao Prisma (`create`, `findMany`, `findUnique`, `update`, `delete`).
- **Controller**: as rotas (`@Post`, `@Get`, `@Patch`, `@Delete`) chamando o service.

No `main.ts`, o `ValidationPipe` global com `whitelist` e `forbidNonWhitelisted`
(campo que não está no DTO é recusado).

**Por que antes do login:** primeiro o sistema precisa funcionar; depois a gente fecha as portas.
Testar tudo no Swagger (`/api`) antes de seguir.

---

## 5. Usuários e senha (`src/usuarios/`)

- A senha é salva com **hash** (`bcrypt.hash`), nunca em texto.
- `findByEmail` é o único lugar que lê o hash (o login precisa dele para comparar).
- `UsuariosModule` **exporta** o `UsuariosService`, porque o `AuthModule` vai usá-lo.

---

## 6. Login com JWT (`src/auth/`)

| Arquivo | Função |
|---|---|
| `dto/login.dto.ts` | e-mail e senha do login |
| `auth.service.ts` | compara a senha (`bcrypt.compare`) e gera o token (`jwtService.signAsync`) |
| `jwt.strategy.ts` | confere a assinatura do token e devolve o `req.user` |
| `auth.controller.ts` | `POST /auth/login` |

O token leva `{ sub, email, perfil }`. Ele é **assinado** com o `JWT_SECRET`
(que só o servidor conhece), então ninguém consegue alterar o perfil sem invalidar o token.

---

## 7. Perfis (USER, INSTRUTOR, ADMIN)

1. `enum Perfil` no schema e o campo `perfil` em `Usuario` (padrão `USER`) → migration.
2. O perfil entra no payload do token (etapa 6).
3. **Cadastro público** em `POST /auth/cadastrar` com o `CadastroDto`, que **não tem** o campo
   `perfil`: quem se cadastra sozinho é sempre aluno.
4. `POST /usuarios` (só ADMIN) usa o `CreateUsuarioDto`, que **tem** `perfil`: é assim que nascem os professores.
5. **Primeiro admin:** como ninguém vira admin pela API, existe o script

   ```
   cd backend
   npm run admin-inicial                                  # admin@cursos.com / admin123
   npm run admin-inicial -- email@x.com senha "Nome"      # outro e-mail (ou promove quem já existe)
   ```

---

## 8. Guards globais (`app.module.ts`)

| Peça | Pergunta | Se falhar |
|---|---|---|
| `JwtAuthGuard` + `@Publico()` | "Quem é você?" | **401** |
| `PerfisGuard` + `@Perfis(...)` | "Seu tipo de conta pode isso?" | **403** |

Os dois são registrados com `APP_GUARD`, então valem para **todas** as rotas.
O padrão se inverte: em vez de lembrar de proteger cada rota, só se libera o que é público
(`/auth/login`, `/auth/cadastrar` e `GET /`).

Ordem de execução de uma requisição:

```
JwtAuthGuard (401) → PerfisGuard (403) → ValidationPipe (400) → Controller → Service (regras de dono, 403) → Prisma
```

---

## 9. Regra de dono do registro (`auth/propriedade.ts`)

Para o que o aluno também usa: matrículas, progresso, avaliações, certificados, assinaturas e pagamentos.

- `@Logado()` entrega quem está logado ao controller, que repassa ao service.
- `exigirDono(idDono, logado)`: o aluno só mexe no que é dele; a equipe (professor/admin) passa.
- `filtroDoDono(logado)`: nas listagens, o aluno recebe só os registros dele.

**Por que no service e não num guard:** para saber de quem é a matrícula 7, é preciso buscá-la no banco.

---

## 10. Dono do curso (`auth/dono-do-curso.ts`)

O professor só edita **os próprios** cursos. A posse desce em cadeia:

```
Aula → Módulo → Curso → ID_Instrutor
```

- Ao criar um curso, o professor vira o instrutor automaticamente (só o admin escolhe outro).
- Cursos, módulos e aulas checam `exigirDonoDoCurso / DoModulo / DaAula` antes de alterar.
- **Aulas liberadas por matrícula:** todo mundo vê a lista de aulas, mas o `urlConteudo`
  só vai para quem está matriculado (ou para a equipe). A resposta traz `liberada: true/false`.

---

## 11. Certificado por conclusão (`certificados.service.ts`)

- `GET /certificados/elegibilidade/:idCurso` → total de aulas, quantas foram concluídas, se já emitiu.
- O aluno só emite o **próprio** certificado, **uma vez**, depois de concluir **todas** as aulas.
- Editar e apagar certificado: só o ADMIN.

---

## 12. Mensagens de erro em português (`src/comum/`)

| Arquivo | Função |
|---|---|
| `rotulos.ts` | nome de cada campo como a pessoa lê ("idCurso" → "Curso") |
| `validacao-em-portugues.ts` | traduz o class-validator pela regra (`isEmail`, `min`, `max`…), ligado no `ValidationPipe` |
| `prisma-exception.filter.ts` | usa os rótulos nos erros do banco |
| `jwt-auth.guard.ts` / `perfis.guard.ts` | 401 e 403 em português |

---

## 13. Frontend (`frontend/`)

1. **Base:** Vite + React, `api.ts` (envia o token e trata 401), `auth.tsx` (guarda o token e lê `perfil` de dentro dele).
2. **Login e cadastro** (`pages/Login.tsx`, `pages/Cadastro.tsx` → `/auth/cadastrar`).
3. **Painel do admin** (`Layout.tsx` + `resources.ts` + `pages/ResourcePage.tsx`): uma tabela com formulário para cada recurso.
4. **Layout de aluno e professor** (`pages/plataforma/LayoutPlataforma.tsx`): barra no topo; o menu muda conforme o perfil.
5. **Área do aluno** (`pages/aluno/`): início, catálogo, página do curso (matrícula, aulas, certificado, avaliação),
   trilhas, minhas matrículas / progresso / avaliações / certificados, planos, assinaturas e pagamentos.
6. **Área do professor** (`pages/professor/` + `ResourcePage` com `recursosProfessor`): painel dos cursos dele
   e as tabelas de catálogo, conteúdo e alunos.

Cada perfil cai na sua área depois do login: ADMIN → `/`, INSTRUTOR → `/professor`, USER → `/aluno`.

> Esconder item de menu **não é segurança**: quem barra de verdade é a API (etapas 8 a 10).
> O menu só evita oferecer uma tela que daria 403.

---

## 14. Roteiro de testes manuais

1. `npm run admin-inicial` e entrar como admin → criar uma categoria, um plano e um **professor** (Usuários, perfil `INSTRUTOR`).
2. Entrar como **professor** → criar curso, módulo e aulas. Tentar editar o curso de outro professor → 403.
3. Criar uma conta pela tela de **cadastro** (vira aluno) → ver o catálogo: as aulas aparecem com 🔒.
4. Como aluno: assinar um plano, matricular-se, concluir as aulas, emitir o certificado e avaliar.
5. Voltar como professor → o painel mostra o aluno matriculado e a avaliação.
6. No Swagger, sem token → 401; aluno em `POST /usuarios` → 403; dados inválidos → 400 em português.

### Quem pode o quê (resumo)

| Recurso | Aluno (USER) | Professor (INSTRUTOR) | Admin |
|---|---|---|---|
| Usuários | só o próprio cadastro | lista; edita só o próprio | tudo |
| Categorias, trilhas | lê | lê e altera | tudo |
| Cursos das trilhas | lê | lê | tudo |
| Cursos, módulos, aulas | lê (conteúdo só se matriculado) | altera **só os seus** | tudo |
| Matrículas, progresso, avaliações | só os seus | vê e altera de todos | tudo |
| Certificados | emite o seu após concluir | emite para qualquer um | tudo (único que edita/apaga) |
| Planos | lê | — | tudo |
| Assinaturas, pagamentos | só os seus | — | tudo |
