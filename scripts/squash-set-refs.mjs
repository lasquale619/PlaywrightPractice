// Recopie la référence de chaque cas de test Squash (CT-...) dans sa "référence du test automatisé".
// Usage : node scripts/squash-set-refs.mjs           -> affiche ce qui serait modifié
//         node scripts/squash-set-refs.mjs --apply   -> applique les modifications
import 'dotenv/config';

const { SQUASH_URL, SQUASH_TOKEN } = process.env;
if (!SQUASH_URL || !SQUASH_TOKEN) {
    console.error('SQUASH_URL ou SQUASH_TOKEN absent du fichier .env');
    process.exit(1);
}

const api = `${SQUASH_URL.replace(/\/$/, '')}/api/rest/latest`;
const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${SQUASH_TOKEN}` };
const apply = process.argv.includes('--apply');

async function call(method, path, body) {
    const response = await fetch(`${api}${path}`, { method, headers, body: body && JSON.stringify(body) });
    if (!response.ok) throw new Error(`${method} ${path} : ${response.status} ${await response.text()}`);
    return response.json();
}

// Liste de tous les cas de test visibles, page par page.
const ids = [];
for (let page = 0; ; page++) {
    const data = await call('GET', `/test-cases?size=100&page=${page}`);
    ids.push(...(data._embedded?.['test-cases'] ?? []).map(tc => tc.id));
    if (page + 1 >= (data.page?.totalPages ?? 1)) break;
}

let count = 0;
for (const id of ids) {
    const tc = await call('GET', `/test-cases/${id}`);
    if (!tc.reference?.startsWith('CT-') || tc.automated_test_reference === tc.reference) continue;

    console.log(`${tc.reference} : "${tc.automated_test_reference ?? ''}" -> "${tc.reference}"`);
    if (apply) await call('PATCH', `/test-cases/${id}`, { _type: 'test-case', automated_test_reference: tc.reference });
    count++;
}

console.log(apply ? `${count} cas de test mis à jour.` : `${count} cas de test à mettre à jour. Relance avec --apply pour appliquer.`);
