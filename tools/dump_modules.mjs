// Выгружает MODULES из docs/data/*.js в JSON (stdout). Порядок — как в docs/index.html.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const docs = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', 'docs');
const html = fs.readFileSync(path.join(docs, 'index.html'), 'utf8');
const listed = [...html.matchAll(/<script src="(data\/[^"]+)"/g)].map(m => m[1]);
const onDisk = fs.readdirSync(path.join(docs, 'data')).filter(f => f.endsWith('.js')).map(f => 'data/' + f);
const ctx = { MODULES: [] };
vm.createContext(ctx);
const files = {};
for (const rel of listed) {
  const before = ctx.MODULES.length;
  vm.runInContext(fs.readFileSync(path.join(docs, rel), 'utf8'), ctx, { filename: rel });
  for (const m of ctx.MODULES.slice(before)) files[m.id] = rel;
}
const out = ctx.MODULES.map(m => ({ ...m, file: files[m.id] }));
process.stdout.write(JSON.stringify({ listed, onDisk, modules: out }));
