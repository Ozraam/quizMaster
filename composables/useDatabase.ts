import { DBManager } from "~/utils/dbManager";

export function useDatabase() {
    const dbManager = DBManager.getInstance();
    return {
        dbManager
    }
}