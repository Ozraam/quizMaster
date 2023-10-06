import { DBManager } from "./dbManager";

export function useDatabase() {
    const dbManager = DBManager.getInstance();
    return {
        dbManager
    }
}