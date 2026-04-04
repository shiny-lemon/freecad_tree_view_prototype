import type { Entry } from "./entry";

export type Transaction = (entries: Entry[]) => Entry[]

export const runTransactions = (entries: Entry[], transactions: Transaction[]): Entry[] => {
    const [transaction, ...remainingTransactions] = transactions;
    const nextEntries = transaction(entries);

    if (transactions.length > 1) {
        return runTransactions(nextEntries, remainingTransactions);
    }

    return nextEntries;
}