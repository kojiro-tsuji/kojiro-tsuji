// プロフィール README の検査。リンク・画像が https か、手元のファイルが実在するか、書きかけの印がないかを見る
import { readFileSync, existsSync } from 'node:fs';

const file = 'README.md';
const errors = [];
if (!existsSync(file)) {
  console.error(`${file} がありません`);
  process.exit(1);
}
const text = readFileSync(file, 'utf8');

const urls = [
  ...text.matchAll(/\]\(([^)\s]+)\)/g),
  ...text.matchAll(/\b(?:src|href)="([^"]+)"/g),
].map((m) => m[1]);

for (const u of urls) {
  if (u.startsWith('#')) continue;
  if (/^https:\/\//.test(u)) continue;
  if (/^[a-z]+:/i.test(u)) {
    errors.push(`https ではないリンク: ${u}`);
    continue;
  }
  if (!existsSync(u.split('#')[0])) errors.push(`手元にないファイル: ${u}`);
}

if (/\b(TODO|FIXME|XXX)\b/.test(text)) errors.push('書きかけの印（TODO など）が残っています');

if (errors.length) {
  for (const e of errors) console.error(e);
  process.exit(1);
}
console.log(`ok: ${file}（リンク ${urls.length} 件）`);
