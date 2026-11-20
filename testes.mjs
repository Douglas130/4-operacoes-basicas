import { abrir } from './audit.mjs';
import path from 'node:path';
import fs from 'node:fs';

const dir = path.resolve(import.meta.dirname);
const { browser, page, erros } = await abrir();
let falhas = 0;
const ok = (cond, msg) => { if (!cond) { falhas++; console.log('  ✗ ' + msg); } };

async function setar(op, nv, qtd, cols, gab) {
  await page.evaluate(([op, nv, qtd, cols, gab]) => {
    const e = MG.estado;
    e.op = op; e.nivel = nv; e.qtd = qtd; e.cols = cols; e.gabarito = gab;
    document.getElementById('inGabarito').checked = gab;
    MG.render();
  }, [op, nv, qtd, cols, gab]);
  await page.waitForTimeout(60);
}

const medir = () => page.evaluate(() => {
  const pgs = [...document.querySelectorAll('.page')];
  return pgs.map(pg => {
    const g = pg.querySelector('.folha-grade');
    const qs = [...pg.querySelectorAll('.q')];
    const p = pg.getBoundingClientRect();
    const cortadas = qs.filter(q => {
      const r = q.getBoundingClientRect();
      return r.bottom > p.bottom - 3 || r.top < p.top + 3 || r.right > p.right - 3;
    }).length;
    return {
      questoes: qs.length,
      over: g.scrollHeight - g.clientHeight,
      cortadas,
      linhas: getComputedStyle(g).gridTemplateRows.split(' ').length
    };
  });
});

console.log('=== Matriz operação × nível (20 questões, 2 colunas) ===');
for (const op of ['add', 'sub', 'mul', 'div']) {
  for (let nv = 1; nv <= 5; nv++) {
    await setar(op, nv, 20, 2, false);
    const [m] = await medir();
    const status = await page.textContent('#status');
    const cols = /(\d) colunas/.exec(status)[1];
    ok(m.over <= 1, `${op}N${nv}: grade estourou (${m.over}px)`);
    ok(m.cortadas === 0, `${op}N${nv}: ${m.cortadas} conta(s) cortada(s)`);
    ok(m.questoes >= 12, `${op}N${nv}: apenas ${m.questoes} questões`);
    console.log(`  ${op} N${nv}: ${m.questoes}q em ${cols} col · linhas ${m.linhas} · ok`);
  }
}

console.log('=== Colunas 3 e 4 ===');
for (const cols of [3, 4]) {
  for (const op of ['add', 'mul', 'div']) {
    await setar(op, 5, 20, cols, false);
    const [m] = await medir();
    ok(m.over <= 1 && m.cortadas === 0, `${op} N5 c${cols}: overflow ${m.over} / cortadas ${m.cortadas}`);
  }
}
console.log('  ok');

console.log('=== Gabarito e rótulos ===');
await page.evaluate(() => { document.getElementById('inRotulos').checked = true; });
for (const op of ['add', 'sub', 'mul', 'div']) {
  await setar(op, 5, 16, 4, true);
  const m = await medir();
  ok(m.length === 2, `${op}: esperava 2 páginas com gabarito, obteve ${m.length}`);
  ok(m.every(x => x.over <= 1 && x.cortadas === 0), `${op}: problema de layout no gabarito`);
}
await page.evaluate(() => { document.getElementById('inRotulos').checked = false; });
console.log('  ok');

console.log('=== Cabeçalho e seed ===');
await page.fill('#inEscola', 'Colégio Teste & Cia <b>');
await page.fill('#inProfessor', 'Prof. Ana');
await page.fill('#inTurma', '5º B');
await page.waitForTimeout(150);
const cab = await page.evaluate(() => document.querySelector('.cabecalho').textContent);
ok(cab.includes('Colégio Teste & Cia <b>'), 'escola não refletida (ou escapada errado)');
ok(cab.includes('Prof. Ana'), 'professor não refletido');
const antes = await page.evaluate(() => [...document.querySelectorAll('.q')].map(q => q.textContent).join('|'));
await page.fill('#inSeed', 'outra-seed');
await page.waitForTimeout(200);
const depois = await page.evaluate(() => [...document.querySelectorAll('.q')].map(q => q.textContent).join('|'));
ok(antes !== depois, 'mudar a seed não alterou as contas');
console.log('  ok');

console.log('=== PDFs ===');
async function pdf(nome, op, nv, qtd, cols, gab, esperado) {
  await setar(op, nv, qtd, cols, gab);
  const arq = path.join(dir, nome);
  await page.pdf({ path: arq, printBackground: true, preferCSSPageSize: true });
  const buf = fs.readFileSync(arq, 'latin1');
  const paginas = (buf.match(/\/Type\s*\/Page[^s]/g) || []).length;
  ok(paginas === esperado, `${nome}: ${paginas} páginas, esperado ${esperado}`);
  console.log(`  ${nome}: ${paginas} pág · ${(fs.statSync(arq).size / 1024).toFixed(1)} KB`);
  return arq;
}
await pdf('atividade_exemplo.pdf', 'add', 4, 16, 4, false, 1);
await pdf('atividade_gabarito.pdf', 'mul', 5, 20, 4, true, 2);
await pdf('atividade_divisao.pdf', 'div', 3, 20, 3, false, 1);
await pdf('atividade_mista.pdf', 'mista', 3, 20, 4, true, 2);

console.log('=== Impressão: UI oculta ===');
await page.emulateMedia({ media: 'print' });
const uiVisivel = await page.evaluate(() =>
  ['painel', 'topo'].map(c => getComputedStyle(document.querySelector('.' + c)).display).join(','));
ok(uiVisivel === 'none,none', 'painel/topo visíveis na impressão: ' + uiVisivel);
await page.emulateMedia({ media: 'screen' });
console.log('  ok');

console.log('\nErros de console:', erros.length ? erros : 'nenhum');
console.log(falhas ? `\n${falhas} FALHA(S)` : '\nTodos os testes funcionais passaram');
await browser.close();
process.exit(falhas || erros.length ? 1 : 0);
