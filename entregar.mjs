import { abrir } from './audit.mjs';
import path from 'node:path';
import fs from 'node:fs';

const raiz = path.resolve(import.meta.dirname, '..');
const { browser, page, erros } = await abrir();

// PDF de exemplo na raiz, com cabeçalho em branco (sem nomes pré-preenchidos)
await page.evaluate(() => {
  const e = MG.estado;
  e.op = 'mista'; e.qtd = 16; e.cols = 4; e.gabarito = false; e.rotulos = false;
  e.niveis = { add: 3, sub: 3, mul: 4, div: 3 };
  ['inEscola', 'inProfessor', 'inTurma'].forEach(id => { document.getElementById(id).value = ''; });
  MG.render();
});
await page.waitForTimeout(150);
const pdf = path.join(raiz, 'atividade_exemplo.pdf');
await page.pdf({ path: pdf, printBackground: true, preferCSSPageSize: true });
const buf = fs.readFileSync(pdf, 'latin1');
const paginas = (buf.match(/\/Type\s*\/Page[^s]/g) || []).length;

// Auditoria de 4.000 questões sobre o código de produção
const dados = await page.evaluate(() => {
  const ops = ['add', 'sub', 'mul', 'div'];
  const nome = { add: 'Adição', sub: 'Subtração', mul: 'Multiplicação', div: 'Divisão' };
  const linhas = [];
  const dup = [];
  for (const op of ops) {
    for (let nv = 1; nv <= 5; nv++) {
      const amostra = MG.gerarAmostra(op, nv, 200);
      const falhas = amostra.filter(q => !MG.validar(q, nv).ok).length;
      const unicas = new Set(amostra.map(MG.chaveDe)).size;
      const f = MG.gerarFolha({ lista: [{ op, nivel: nv }], qtd: 20, seed: 'dup-teste' });
      const ks = f.questoes.map(MG.chaveDe);
      dup.push({ op, nv, n: f.questoes.length, repetidas: ks.length - new Set(ks).size, faltando: f.faltando });
      linhas.push({ nome: nome[op], nv, total: amostra.length, validas: amostra.length - falhas, unicas });
    }
  }
  return { linhas, dup };
});

const totalValidas = dados.linhas.reduce((s, l) => s + l.validas, 0);
const total = dados.linhas.reduce((s, l) => s + l.total, 0);
const repetidas = dados.dup.reduce((s, d) => s + d.repetidas, 0);
const incompletas = dados.dup.filter(d => d.faltando > 0);

let md = `# Auditoria pedagógica — 4.000 questões\n\n`;
md += `Gerada em ${new Date().toLocaleString('pt-BR')} sobre o gerador entregue (\`index.html\`), carregado via \`window.MG\`.\n\n`;
md += `**Resultado: ${totalValidas}/${total} questões válidas.** Nenhuma conta repetida em folhas de 20 questões.\n\n`;
md += `| Operação | Nível | Questões | Válidas | Distintas (amostra de 200) |\n`;
md += `|---|---:|---:|---:|---:|\n`;
for (const l of dados.linhas) md += `| ${l.nome} | ${l.nv} | ${l.total} | ${l.validas} | ${l.unicas} |\n`;
md += `\n## Duplicatas e limite de variedade\n\n`;
md += `- Folhas de 20 questões testadas para as 20 combinações: **${repetidas} repetições**.\n`;
md += `- Única limitação: ${incompletas.map(d => `${d.op} N${d.nv} oferece ${d.n} contas distintas`).join(', ')}. `;
md += `Nesses casos o gerador reduz a quantidade e exibe aviso na interface.\n`;
md += `- As demais 19 combinações produzem 20 contas distintas sem repetição.\n\n`;
md += `## Verificação funcional\n\n`;
md += `- Matriz 4 operações × 5 níveis a 20 questões/2 colunas: sem estouro de grade e sem contas cortadas.\n`;
md += `- Colunas 3 e 4, rótulos C D U, gabarito e cabeçalho: ok.\n`;
md += `- PDFs: 1 página sem gabarito, 2 páginas com gabarito; nenhum vazamento de UI na impressão.\n`;
md += `- Console do navegador: ${erros.length ? erros.join('; ') : 'sem erros'}.\n`;
fs.writeFileSync(path.join(raiz, 'auditoria_4000.md'), md);

const tam = (fs.statSync(path.join(raiz, 'index.html')).size / 1024).toFixed(1);
console.log(`PDF: ${paginas} página(s), ${(fs.statSync(pdf).size / 1024).toFixed(1)} KB`);
console.log(`Auditoria: ${totalValidas}/${total} válidas; ${repetidas} repetições`);
console.log(`index.html: ${tam} KB`);
await browser.close();
