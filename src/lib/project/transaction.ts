import type { Entry } from "./entry";

export type Transaction = (entries: Entry[]) => Entry[]

export const runTransactions = (entries: Entry[], transactions: Transaction[]): Entry[] => {
    const [transaction, ...remainingTransactions] = transactions;
    const unlinkedEntries = structuredClone(entries);

    const nextEntries = transaction(unlinkedEntries);

    if (transactions.length <= 1) {
        return nextEntries;
    }

    return runTransactions(nextEntries, remainingTransactions);
}