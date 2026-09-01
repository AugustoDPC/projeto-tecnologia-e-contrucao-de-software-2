-- CreateTable
CREATE TABLE "Usuarios" (
    "ID_Usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "NomeCompleto" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "SenhaHash" TEXT NOT NULL,
    "DataCadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Categorias" (
    "ID_Categoria" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nome" TEXT NOT NULL,
    "Descricao" TEXT
);

-- CreateTable
CREATE TABLE "Cursos" (
    "ID_Curso" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Titulo" TEXT NOT NULL,
    "Descricao" TEXT,
    "ID_Instrutor" INTEGER NOT NULL,
    "ID_Categoria" INTEGER NOT NULL,
    "Nivel" TEXT,
    "DataPublicacao" DATETIME,
    "TotalAulas" INTEGER,
    "TotalHoras" INTEGER,
    CONSTRAINT "Cursos_ID_Instrutor_fkey" FOREIGN KEY ("ID_Instrutor") REFERENCES "Usuarios" ("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cursos_ID_Categoria_fkey" FOREIGN KEY ("ID_Categoria") REFERENCES "Categorias" ("ID_Categoria") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Modulos" (
    "ID_Modulo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ID_Curso" INTEGER NOT NULL,
    "Titulo" TEXT NOT NULL,
    "Ordem" INTEGER NOT NULL,
    CONSTRAINT "Modulos_ID_Curso_fkey" FOREIGN KEY ("ID_Curso") REFERENCES "Cursos" ("ID_Curso") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Aulas" (
    "ID_Aula" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ID_Modulo" INTEGER NOT NULL,
    "Titulo" TEXT NOT NULL,
    "TipoConteudo" TEXT NOT NULL,
    "URL_Conteudo" TEXT,
    "DuracaoMinutos" INTEGER,
    "Ordem" INTEGER NOT NULL,
    CONSTRAINT "Aulas_ID_Modulo_fkey" FOREIGN KEY ("ID_Modulo") REFERENCES "Modulos" ("ID_Modulo") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Matriculas" (
    "ID_Matricula" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Curso" INTEGER NOT NULL,
    "DataMatricula" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DataConclusao" DATETIME,
    CONSTRAINT "Matriculas_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuarios" ("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Matriculas_ID_Curso_fkey" FOREIGN KEY ("ID_Curso") REFERENCES "Cursos" ("ID_Curso") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Progresso_Aulas" (
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Aula" INTEGER NOT NULL,
    "DataConclusao" DATETIME NOT NULL,
    "Status" TEXT NOT NULL,

    PRIMARY KEY ("ID_Usuario", "ID_Aula"),
    CONSTRAINT "Progresso_Aulas_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuarios" ("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Progresso_Aulas_ID_Aula_fkey" FOREIGN KEY ("ID_Aula") REFERENCES "Aulas" ("ID_Aula") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Avaliacoes" (
    "ID_Avaliacao" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Curso" INTEGER NOT NULL,
    "Nota" INTEGER NOT NULL,
    "Comentario" TEXT,
    "DataAvaliacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Avaliacoes_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuarios" ("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Avaliacoes_ID_Curso_fkey" FOREIGN KEY ("ID_Curso") REFERENCES "Cursos" ("ID_Curso") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trilhas" (
    "ID_Trilha" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Titulo" TEXT NOT NULL,
    "Descricao" TEXT,
    "ID_Categoria" INTEGER NOT NULL,
    CONSTRAINT "Trilhas_ID_Categoria_fkey" FOREIGN KEY ("ID_Categoria") REFERENCES "Categorias" ("ID_Categoria") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Trilhas_Cursos" (
    "ID_Trilha" INTEGER NOT NULL,
    "ID_Curso" INTEGER NOT NULL,
    "Ordem" INTEGER NOT NULL,

    PRIMARY KEY ("ID_Trilha", "ID_Curso"),
    CONSTRAINT "Trilhas_Cursos_ID_Trilha_fkey" FOREIGN KEY ("ID_Trilha") REFERENCES "Trilhas" ("ID_Trilha") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Trilhas_Cursos_ID_Curso_fkey" FOREIGN KEY ("ID_Curso") REFERENCES "Cursos" ("ID_Curso") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Certificados" (
    "ID_Certificado" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Curso" INTEGER NOT NULL,
    "ID_Trilha" INTEGER,
    "CodigoVerificacao" TEXT NOT NULL,
    "DataEmissao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Certificados_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuarios" ("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Certificados_ID_Curso_fkey" FOREIGN KEY ("ID_Curso") REFERENCES "Cursos" ("ID_Curso") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Certificados_ID_Trilha_fkey" FOREIGN KEY ("ID_Trilha") REFERENCES "Trilhas" ("ID_Trilha") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Planos" (
    "ID_Plano" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nome" TEXT NOT NULL,
    "Descricao" TEXT,
    "Preco" DECIMAL NOT NULL,
    "DuracaoMeses" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Assinaturas" (
    "ID_Assinatura" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ID_Usuario" INTEGER NOT NULL,
    "ID_Plano" INTEGER NOT NULL,
    "DataInicio" DATETIME NOT NULL,
    "DataFim" DATETIME NOT NULL,
    CONSTRAINT "Assinaturas_ID_Usuario_fkey" FOREIGN KEY ("ID_Usuario") REFERENCES "Usuarios" ("ID_Usuario") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Assinaturas_ID_Plano_fkey" FOREIGN KEY ("ID_Plano") REFERENCES "Planos" ("ID_Plano") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pagamentos" (
    "ID_Pagamento" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ID_Assinatura" INTEGER NOT NULL,
    "ValorPago" DECIMAL NOT NULL,
    "DataPagamento" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "MetodoPagamento" TEXT NOT NULL,
    "Id_Transacao_Gateway" TEXT NOT NULL,
    CONSTRAINT "Pagamentos_ID_Assinatura_fkey" FOREIGN KEY ("ID_Assinatura") REFERENCES "Assinaturas" ("ID_Assinatura") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_Email_key" ON "Usuarios"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Categorias_Nome_key" ON "Categorias"("Nome");

-- CreateIndex
CREATE UNIQUE INDEX "Certificados_CodigoVerificacao_key" ON "Certificados"("CodigoVerificacao");
