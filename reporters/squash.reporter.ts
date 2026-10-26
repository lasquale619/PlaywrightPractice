import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';

type SquashStatus = 'SUCCESS' | 'FAILURE' | 'BLOCKED' | 'SKIPPED';

type SquashTest = {
    reference: string;
    status: SquashStatus;
    duration: number;
    // Messages d'erreur, envoyés en pièce jointe : le champ failure_details est réservé aux licences payantes.
    errors: string[];
};

const STATUS: Record<TestResult['status'], SquashStatus> = {
    passed: 'SUCCESS',
    failed: 'FAILURE',
    timedOut: 'FAILURE',
    interrupted: 'BLOCKED',
    skipped: 'SKIPPED',
};

// Du moins grave au plus grave : si plusieurs tests partagent un cas de test, le pire résultat l'emporte.
const SEVERITY: SquashStatus[] = ['SUCCESS', 'SKIPPED', 'BLOCKED', 'FAILURE'];

const stripAnsi = (text: string) => text.replace(/\u001b\[[0-9;]*m/g, '');

const toSquash = ({ errors, ...test }: SquashTest) => ({
    ...test,
    attachments: errors.length
        ? [{ name: 'erreur.txt', content: Buffer.from(errors.join('\n\n')).toString('base64') }]
        : [],
});

/**
 * Envoie les résultats des tests à une itération Squash TM.
 * Un test est envoyé s'il porte un tag @CT-..., égal à la "référence du test automatisé" de son cas de test Squash.
 * Ne fait rien si SQUASH_URL, SQUASH_TOKEN ou SQUASH_ITERATION_ID est absent.
 */
export default class SquashReporter implements Reporter {
    // Dernier essai de chaque test : un retry remplace l'essai précédent.
    private readonly lastResults = new Map<string, { test: TestCase; result: TestResult }>();

    onTestEnd(test: TestCase, result: TestResult) {
        this.lastResults.set(test.id, { test, result });
    }

    async onEnd(_result: FullResult) {
        const { SQUASH_URL, SQUASH_TOKEN, SQUASH_ITERATION_ID } = process.env;
        if (!SQUASH_URL || !SQUASH_TOKEN || !SQUASH_ITERATION_ID) {
            console.log('[squash] SQUASH_URL, SQUASH_TOKEN ou SQUASH_ITERATION_ID absent : résultats non envoyés.');
            return;
        }

        const tests = new Map<string, SquashTest>();
        for (const { test, result } of this.lastResults.values()) {
            for (const tag of test.tags.filter(t => t.startsWith('@CT-'))) {
                const reference = tag.slice(1);
                const status = STATUS[result.status];
                const errors = result.errors.map(e => stripAnsi(e.message ?? ''));
                const existing = tests.get(reference);
                if (!existing) {
                    tests.set(reference, { reference, status, duration: result.duration, errors });
                    continue;
                }
                existing.duration += result.duration;
                existing.errors.push(...errors);
                if (SEVERITY.indexOf(status) > SEVERITY.indexOf(existing.status)) existing.status = status;
            }
        }

        if (tests.size === 0) {
            console.log('[squash] Aucun test avec un tag @CT-... : rien à envoyer.');
            return;
        }

        const url = `${SQUASH_URL.replace(/\/$/, '')}/api/rest/latest/import/results/${SQUASH_ITERATION_ID}`;
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SQUASH_TOKEN}` },
                body: JSON.stringify({ tests: [...tests.values()].map(toSquash) }),
            });
            if (response.status === 204) {
                console.log(`[squash] ${tests.size} résultats envoyés à l'itération ${SQUASH_ITERATION_ID}.`);
            } else {
                console.log(`[squash] Réponse ${response.status} : ${await response.text()}`);
            }
        } catch (error) {
            console.log(`[squash] Envoi impossible vers ${url} : ${error}`);
        }
    }
}
