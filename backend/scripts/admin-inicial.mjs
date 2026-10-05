// Cria (ou promove) a conta de administrador da plataforma.
//
//   npm run admin-inicial                                   -> admin@cursos.com / admin123
//   npm run admin-inicial -- email@x.com minhasenha "Meu Nome"
//
// Por que existe: o cadastro público sempre cria ALUNO, e só um ADMIN cria
// professores e outros admins. Então o PRIMEIRO admin precisa nascer fora da API.
// Se o e-mail já existir, a pessoa vira ADMIN (e a senha só muda se for informada).
// Grava direto no banco (a API nem precisa estar rodando).
import 'dotenv/config';
import bcrypt from 'bcrypt';
import { execSync } from 'node:child_process';

const [email = 'admin@cursos.com', senha, nome = 'Administrador'] = process.argv.slice(2);
const hash = await bcrypt.hash(senha ?? 'admin123', 10);
const texto = (valor) => `'${String(valor).replace(/'/g, "''")}'`;

// "ON CONFLICT" = se o e-mail já existe, atualiza em vez de criar.
const sql = `
INSERT INTO "Usuarios" ("NomeCompleto", "Email", "SenhaHash", "Perfil")
VALUES (${texto(nome)}, ${texto(email)}, ${texto(hash)}, 'ADMIN')
ON CONFLICT ("Email") DO UPDATE SET "Perfil" = 'ADMIN'${senha ? ', "SenhaHash" = excluded."SenhaHash"' : ''};
`;

execSync('npx prisma db execute --stdin --schema prisma/schema.prisma', {
  input: sql,
  stdio: ['pipe', 'ignore', 'inherit'],
});

console.log(`Pronto! ${email} agora é ADMIN.`);
console.log(senha ? `Senha: ${senha}` : 'Senha: admin123 (se a conta foi criada agora) ou a mesma de antes (se já existia).');
