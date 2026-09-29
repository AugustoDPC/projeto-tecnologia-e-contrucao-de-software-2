/*
  Warnings:

  - You are about to alter the column `ValorPago` on the `Pagamentos` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.
  - You are about to alter the column `Preco` on the `Planos` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Float`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pagamentos" (
    "ID_Pagamento" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ID_Assinatura" INTEGER NOT NULL,
    "ValorPago" REAL NOT NULL,
    "DataPagamento" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "MetodoPagamento" TEXT NOT NULL,
    "Id_Transacao_Gateway" TEXT NOT NULL,
    CONSTRAINT "Pagamentos_ID_Assinatura_fkey" FOREIGN KEY ("ID_Assinatura") REFERENCES "Assinaturas" ("ID_Assinatura") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Pagamentos" ("DataPagamento", "ID_Assinatura", "ID_Pagamento", "Id_Transacao_Gateway", "MetodoPagamento", "ValorPago") SELECT "DataPagamento", "ID_Assinatura", "ID_Pagamento", "Id_Transacao_Gateway", "MetodoPagamento", "ValorPago" FROM "Pagamentos";
DROP TABLE "Pagamentos";
ALTER TABLE "new_Pagamentos" RENAME TO "Pagamentos";
CREATE TABLE "new_Planos" (
    "ID_Plano" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nome" TEXT NOT NULL,
    "Descricao" TEXT,
    "Preco" REAL NOT NULL,
    "DuracaoMeses" INTEGER NOT NULL
);
INSERT INTO "new_Planos" ("Descricao", "DuracaoMeses", "ID_Plano", "Nome", "Preco") SELECT "Descricao", "DuracaoMeses", "ID_Plano", "Nome", "Preco" FROM "Planos";
DROP TABLE "Planos";
ALTER TABLE "new_Planos" RENAME TO "Planos";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
