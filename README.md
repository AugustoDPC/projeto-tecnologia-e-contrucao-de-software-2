# projeto-tecnologia-e-contrucao-de-software-2

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
npx prisma generate
```
```
npx prisma migrate deploy
```
```
npm run start:dev
```

```
Terminal do backend:

cd backend
npm run start:dev

Terminal do Prisma Studio:

cd backend
npx prisma studio
````


Swagger é esse:

```
https://SEU-CODESPACE-3000.app.github.dev/api
```

caminhos:
Porta 3000 → backend NestJS / Swagger(abrir com o /api final): 
https://SEU-CODESPACE-3000.app.github.dev/api


1. Criar uma nova tabela
backend/prisma/schema.prisma
exemplo, para criar uma tabela Instrutores:

model Instrutor {
  idInstrutor Int    @id @default(autoincrement())
  nome        String
  email       String @unique

  @@map("Instrutores")
}

Depois:

npx prisma format
npx prisma migrate dev --name criar_instrutores
npx prisma generate

2. Adicionar um campo em uma tabela existente
Suponha que Usuarios tenha:

model Usuario {
  idUsuario   Int    @id @default(autoincrement())
  nomeCompleto String
  email        String @unique
  senha        String
}

Altere para:

model Usuario {
  idUsuario    Int     @id @default(autoincrement())
  nomeCompleto String
  email        String  @unique
  senha        String
  telefone     String?
}

Depois:

npx prisma format
npx prisma migrate dev --name adicionar_telefone_usuario
npx prisma generate


3. Criar relacionamento entre tabelas

model Categoria {
  idCategoria Int     @id @default(autoincrement())
  nome        String
  cursos      Curso[]
}

model Curso {
  idCurso     Int       @id @default(autoincrement())
  titulo      String

  idCategoria Int
  categoria   Categoria @relation(
    fields: [idCategoria],
    references: [idCategoria]
  )
}

npx prisma migrate dev --name relacionar_curso_categoria
npx prisma generate


4. Inserir dados

Swagger — recomendado para testar o sistema

Por exemplo:

POST /usuarios

{
  "nomeCompleto": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}