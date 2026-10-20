import { expect, type APIRequestContext, type PlaywrightWorkerArgs } from '@playwright/test';

type NoteData = {
    category: 'Home' | 'Work' | 'Personal';
    completed: boolean;
    description: string;
    title: string;
};

/**
 * Client de l'API Notes : connexion une fois, puis chaque requête envoie le token automatiquement.
 */
export class NotesClient {
    private constructor(private readonly api: APIRequestContext) {}

    static async login(
        playwright: PlaywrightWorkerArgs['playwright'],
        baseURL: string | undefined,
        email: string | undefined,
        password: string | undefined,
    ): Promise<NotesClient> {
        const login = await playwright.request.newContext({ baseURL });
        const response = await login.post('/notes/api/users/login', { data: { email, password } });
        expect(response.status()).toBe(200);
        const token: string = (await response.json()).data.token;
        await login.dispose();

        const api = await playwright.request.newContext({
            baseURL,
            extraHTTPHeaders: { 'X-Auth-Token': token },
        });
        return new NotesClient(api);
    }

    getNotes() {
        return this.api.get('/notes/api/notes');
    }

    /** Crée une note et renvoie son id. */
    async createNote(title: string): Promise<string> {
        const response = await this.api.post('/notes/api/notes', {
            data: { category: 'Personal', completed: false, description: 'new description', title },
        });
        expect(response.status()).toBe(200);
        return (await response.json()).data.id;
    }

    updateNote(id: string, data: NoteData) {
        return this.api.put(`/notes/api/notes/${id}`, { data });
    }

    deleteNote(id: string) {
        return this.api.delete(`/notes/api/notes/${id}`);
    }

    dispose() {
        return this.api.dispose();
    }
}
