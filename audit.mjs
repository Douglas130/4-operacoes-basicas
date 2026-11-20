import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const raiz = path.resolve(import.meta.dirname, '..');
const url = 'file:///' + path.join(raiz, 'index.html').replace(/\\/g, '/');

export async function abrir(opts = {}) {
  const browser = await chromium.launch({
    channel: 'chrome',
    args: ['--allow-file-access-from-files']
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const erros = [];
  page.on('console', m => { if (m.type() === 'error') erros.push(m.text()); });
  page.on('pageerror', e => erros.push('PAGEERROR: ' + e.message));
  await page.goto(url);
  await page.waitForTimeout(400);
  return { browser, page, erros, url };
}

if (process.argv[1] && process.argv[1].endsWith('audit.mjs')) {
  const { browser, page, erros } = await abrir();
  if (erros.length) { console.log('ERROS DE CONSOLE:', erros); }

  const rel = await page.evaluate(() => {
    const ops = ['add', 'sub', 'mul', 'div'];
    const out = [];
    for (const op of ops) {
      for (let nv = 1; nv <= 5; nv++) {
        const amostra = MG.gerarAmostra(op, nv, 200);
        let falhas = 0; const exemplos = [];
        const chaves = new Set();
        for (const q of amostra) {
          const v = MG.validar(q, nv);
          if (!v.ok) { falhas++; if (exemplos.length < 3) exemplos.push({ q, motivo: v.motivo }); }
          chaves.add(MG.chaveDe(q));
        }
        out.push({ op, nv, total: amostra.length, falhas, unicas: chaves.size, exemplos, amostra: amostra.slice(0, 4) });
      }
    }
    return out;
  });

  let ruins = 0;
  for (const r of rel) {
    if (r.falhas) ruins++;
    console.log(`${r.op} N${r.nv}: ${r.total - r.falhas}/${r.total} válidas · distintas ${r.unicas} · ex: ` +
      r.amostra.map(q => q.op === 'div' ? `${q.operandos[0]}÷${q.operandos[1]}` : q.operandos.join(q.op === 'add' ? '+' : q.op === 'sub' ? '-' : 'x')).join('  '));
    if (r.exemplos.length) console.log('   FALHAS:', JSON.stringify(r.exemplos));
  }
  console.log(ruins ? `\n${ruins} combinações com falha` : '\nAuditoria pedagógica: 4.000/4.000 questões válidas');

  // duplicatas em folhas de 20
  const dup = await page.evaluate(() => {
    const res = [];
    for (const op of ['add', 'sub', 'mul', 'div']) {
      for (let nv = 1; nv <= 5; nv++) {
        const f = MG.gerarFolha({ lista: [{ op, nivel: nv }], qtd: 20, seed: 'dup-teste' });
        const ks = f.questoes.map(MG.chaveDe);
        res.push({ op, nv, n: f.questoes.length, dups: ks.length - new Set(ks).size, faltando: f.faltando });
      }
    }
    return res;
  });
  const comDup = dup.filter(d => d.dups > 0);
  console.log('Duplicatas em folhas de 20:', comDup.length ? JSON.stringify(comDup) : 'nenhuma');
  console.log('Folhas incompletas:', dup.filter(d => d.faltando > 0).map(d => `${d.op}N${d.nv}=${d.n}`).join(', ') || 'nenhuma');
  await browser.close();
  process.exit(ruins || comDup.length ? 1 : 0);
}
