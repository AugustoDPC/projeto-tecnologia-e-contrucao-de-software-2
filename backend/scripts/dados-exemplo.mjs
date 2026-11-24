// Cria dados de exemplo para testar o app mobile:
//   npm run dados-exemplo
// Cria o admin (admin@cursos.com / admin123), 1 categoria, 2 cursos com módulos e aulas,
// 1 trilha com os dois cursos e 2 planos (Mensal e Anual). Pode rodar mais de uma vez (não duplica).
// Grava direto no banco (a API nem precisa estar rodando).
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { execSync } from 'node:child_process';

const hash = await bcrypt.hash('admin123', 10);
const admin = `(SELECT "ID_Usuario" FROM "Usuarios" WHERE "Email" = 'admin@cursos.com')`;

const sql = `
INSERT INTO "Usuarios" ("NomeCompleto", "Email", "SenhaHash", "Perfil")
VALUES ('Administrador', 'admin@cursos.com', '${hash}', 'ADMIN')
ON CONFLICT ("Email") DO NOTHING;

INSERT INTO "Categorias" ("ID_Categoria", "Nome") VALUES (1, 'Programação') ON CONFLICT DO NOTHING;

INSERT INTO "Cursos" ("ID_Curso", "Titulo", "Descricao", "ID_Instrutor", "ID_Categoria", "Nivel")
VALUES (1, 'React Native', 'Crie apps para celular com Expo', ${admin}, 1, 'Iniciante'),
       (2, 'NestJS', 'Crie APIs com NestJS e Prisma', ${admin}, 1, 'Intermediário')
ON CONFLICT DO NOTHING;

INSERT INTO "Modulos" ("ID_Modulo", "ID_Curso", "Titulo", "Ordem")
VALUES (1, 1, 'Primeiros passos', 1), (2, 1, 'Navegação', 2), (3, 2, 'Introdução ao NestJS', 1)
ON CONFLICT DO NOTHING;

INSERT INTO "Aulas" ("ID_Aula", "ID_Modulo", "Titulo", "TipoConteudo", "URL_Conteudo", "DuracaoMinutos", "Ordem")
VALUES (1, 1, 'Instalando o Expo', 'Vídeo', 'https://docs.expo.dev', 10, 1),
       (2, 1, 'Componentes básicos', 'Vídeo', 'https://reactnative.dev/docs/components-and-apis', 15, 2),
       (3, 2, 'React Navigation', 'Artigo', 'https://reactnavigation.org', 20, 1),
       (4, 3, 'Criando o primeiro módulo', 'Vídeo', 'https://docs.nestjs.com', 15, 1)
ON CONFLICT DO NOTHING;

INSERT INTO "Trilhas" ("ID_Trilha", "Titulo", "Descricao", "ID_Categoria")
VALUES (1, 'Desenvolvedor Full Stack', 'Do backend ao app', 1)
ON CONFLICT DO NOTHING;

INSERT INTO "Trilhas_Cursos" ("ID_Trilha", "ID_Curso", "Ordem")
VALUES (1, 2, 1), (1, 1, 2)
ON CONFLICT DO NOTHING;

INSERT INTO "Planos" ("ID_Plano", "Nome", "Descricao", "Preco", "DuracaoMeses")
VALUES (1, 'Mensal', 'Acesso por 1 mês', 49.9, 1),
       (2, 'Anual', 'Acesso por 12 meses', 399.9, 12)
ON CONFLICT DO NOTHING;
`;

execSync('npx prisma db execute --stdin --schema prisma/schema.prisma', {
  input: sql,
  stdio: ['pipe', 'ignore', 'inherit'],
});

console.log('Pronto! Dados de exemplo criados.');
console.log('Admin: admin@cursos.com / admin123');
