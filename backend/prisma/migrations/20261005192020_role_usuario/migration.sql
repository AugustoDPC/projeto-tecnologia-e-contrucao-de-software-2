-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuarios" (
    "ID_Usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "NomeCompleto" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "SenhaHash" TEXT NOT NULL,
    "DataCadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Role" TEXT NOT NULL DEFAULT 'USUARIO'
);
INSERT INTO "new_Usuarios" ("DataCadastro", "Email", "ID_Usuario", "NomeCompleto", "SenhaHash") SELECT "DataCadastro", "Email", "ID_Usuario", "NomeCompleto", "SenhaHash" FROM "Usuarios";
DROP TABLE "Usuarios";
ALTER TABLE "new_Usuarios" RENAME TO "Usuarios";
CREATE UNIQUE INDEX "Usuarios_Email_key" ON "Usuarios"("Email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- O primeiro usuário já cadastrado vira administrador.
UPDATE "Usuarios" SET "Role" = 'ADMIN' WHERE "ID_Usuario" = (SELECT MIN("ID_Usuario") FROM "Usuarios");
