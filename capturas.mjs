import { abrir } from './audit.mjs';
import path from 'node:path';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const dir = path.resolve(import.meta.dirname);
const cap = path.join(dir, 'capturas');
fs.mkdirSync(cap, { recursive: true });
const { browser, page, erros } = await abrir();

async function montar(op, nv, qtd, cols, gab, rot, nome) {
  await page.evaluate(([op, nv, qtd, cols, gab, rot]) => {
    const e = MG.estado;
    e.op = op; e.nivel = nv; e.qtd = qtd; e.cols = cols; e.gabarito = gab; e.rotulos = rot;
    document.getElementById('inGabarito').checked = gab;
    document.getElementById('inRotulos').checked = rot;
    document.getElementById('selQtd').value = String(qtd);
    MG.render();
  }, [op, nv, qtd, cols, gab, rot]);
  await page.waitForTimeout(150);
  const arq = path.join(cap, nome + '.pdf');
  await page.pdf({ path: arq, printBackground: true, preferCSSPageSize: true });
  return arq;
}

// UI
await montar('mista', 3, 16, 4, false, false, '_tmp');
await page.screenshot({ path: path.join(cap, '01_interface.png') });

const jobs = [
  ['add', 3, 12, 2, false, false, '02_adicao_n3_2col'],
  ['add', 5, 20, 4, false, true, '03_adicao_n5_rotulos'],
  ['sub', 5, 20, 3, false, false, '04_subtracao_n5'],
  ['mul', 5, 20, 4, true, false, '05_multiplicacao_n5_gabarito'],
  ['div', 5, 20, 4, false, false, '06_divisao_n5'],
  ['div', 4, 16, 3, true, false, '07_divisao_gabarito']
];
for (const [op, nv, qtd, cols, gab, rot, nome] of jobs) {
  const arq = await montar(op, nv, qtd, cols, gab, rot, nome);
  try {
    execFileSync('pdftoppm', ['-png', '-r', '150', arq, path.join(cap, nome)]);
  } catch (e) { console.log('pdftoppm falhou em', nome, e.message); }
  console.log('ok', nome);
}
await montar('mista', 3, 16, 4, false, false, '_tmp');
fs.rmSync(path.join(cap, '_tmp.pdf'), { force: true });

// misto com todas as operações no nível 5 (caso extremo)
await page.evaluate(() => {
  const e = MG.estado;
  e.op = 'mista'; e.qtd = 20; e.cols = 4; e.gabarito = false; e.rotulos = false;
  Object.keys(e.niveis).forEach(k => e.niveis[k] = 5);
  MG.render();
});
await page.waitForTimeout(150);
const arqM = path.join(cap, '08_misto_n5.pdf');
await page.pdf({ path: arqM, printBackground: true, preferCSSPageSize: true });
execFileSync('pdftoppm', ['-png', '-r', '150', arqM, path.join(cap, '08_misto_n5')]);
console.log('ok 08_misto_n5');
console.log('Erros:', erros.length ? erros : 'nenhum');
await browser.close();
