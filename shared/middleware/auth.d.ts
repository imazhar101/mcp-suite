import { ApiCredentials } from '../types/common.js';
export declare class AuthMiddleware {
    private credentials;
    constructor(credentials: ApiCredentials);
    private validateCredentials;
    getAuthHeaders(): Record<string, string>;
    isAuthenticated(): boolean;
}
//# sourceMappingURL=auth.d.ts.map