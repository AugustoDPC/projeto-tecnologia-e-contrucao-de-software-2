-- Troca a coluna "Role" (ADMIN/USUARIO) por "Perfil" (USER/INSTRUTOR/ADMIN),
-- mantendo o tipo de conta de quem já existe.
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuarios" (
    "ID_Usuario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "NomeCompleto" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "SenhaHash" TEXT NOT NULL,
    "DataCadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Perfil" TEXT NOT NULL DEFAULT 'USER'
);
INSERT INTO "new_Usuarios" ("DataCadastro", "Email", "ID_Usuario", "NomeCompleto", "SenhaHash", "Perfil")
SELECT "DataCadastro", "Email", "ID_Usuario", "NomeCompleto", "SenhaHash",
       CASE "Role" WHEN 'ADMIN' THEN 'ADMIN' ELSE 'USER' END
FROM "Usuarios";
DROP TABLE "Usuarios";
ALTER TABLE "new_Usuarios" RENAME TO "Usuarios";
CREATE UNIQUE INDEX "Usuarios_Email_key" ON "Usuarios"("Email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
