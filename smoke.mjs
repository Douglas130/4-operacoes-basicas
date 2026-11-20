import { abrir } from './audit.mjs';
import path from 'node:path';
import fs from 'node:fs';

const dir = path.resolve(import.meta.dirname);
const { browser, page, erros } = await abrir();

async function config(op, nv, qtd, cols, gab) {
  await page.evaluate(([op, nv, qtd, cols, gab]) => {
    const e = MG.estado;
    e.op = op; e.nivel = nv; e.qtd = qtd; e.cols = cols;
    e.gabarito = gab;
    document.getElementById('inGabarito').checked = gab;
    document.getElementById('selQtd').value = String(qtd);
    MG.render();
  }, [op, nv, qtd, cols, gab]);
  await page.waitForTimeout(120);
}

const casos = [
  ['add', 2, 16, 4], ['add', 3, 20, 2], ['add', 5, 20, 4],
  ['sub', 5, 20, 2], ['mul', 5, 20, 4], ['mul', 5, 20, 2],
  ['div', 3, 20, 2], ['div', 5, 20, 4], ['mul', 2, 20, 4]
];

for (const [op, nv, qtd, cols] of casos) {
  await config(op, nv, qtd, cols, false);
  const info = await page.evaluate(() => {
    const pg = document.querySelector('.page');
    const g = document.querySelector('.folha-grade');
    const qs = [...document.querySelectorAll('.q')];
    const cortadas = qs.filter(q => {
      const r = q.getBoundingClientRect(), p = pg.getBoundingClientRect();
      return r.bottom > p.bottom - 4 || r.right > p.right - 4;
    }).length;
    const internas = qs.filter(q => {
      const r = q.firstElementChild ? q.getBoundingClientRect() : null;
      return false;
    }).length;
    return {
      paginas: document.querySelectorAll('.page').length,
      questoes: qs.length,
      overflowPagina: pg.scrollHeight - pg.clientHeight,
      overflowGrade: g.scrollHeight - g.clientHeight,
      cortadas,
      status: document.getElementById('status').textContent
    };
  });
  console.log(`${op} N${nv} q${qtd} c${cols}:`, JSON.stringify(info));
}

// PDFs
async function pdf(nome, op, nv, qtd, cols, gab) {
  await config(op, nv, qtd, cols, gab);
  const arq = path.join(dir, nome);
  await page.pdf({ path: arq, printBackground: true, preferCSSPageSize: true });
  const buf = fs.readFileSync(arq, 'latin1');
  const paginas = (buf.match(/\/Type\s*\/Page[^s]/g) || []).length;
  console.log(`PDF ${nome}: ${paginas} página(s), ${(fs.statSync(arq).size / 1024).toFixed(1)} KB`);
  return paginas;
}
await pdf('exemplo_sem_gabarito.pdf', 'add', 4, 20, 4, false);
await pdf('exemplo_com_gabarito.pdf', 'mul', 5, 16, 4, true);
await pdf('teste_divisao.pdf', 'div', 4, 12, 3, false);
await pdf('teste_misto.pdf', 'mista', 3, 20, 4, true);

await page.screenshot({ path: path.join(dir, 'ui.png'), fullPage: false });
console.log('Erros de console:', erros.length ? erros : 'nenhum');
await browser.close();
