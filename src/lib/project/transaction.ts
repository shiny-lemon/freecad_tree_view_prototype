import { transactions } from "$lib/data/data.svelte";
import type { Document, DocumentId } from "./document";
import type { Entry } from "./entry";
import { getDocument, getSelectedId, type Project } from "./project";

export type TransactionProject = (project: Project) => Project
export type TransactionDocument = (document: Document) => Document
export type TransactionEntries = (entries: Entry[]) => Entry[]

export const transactionProject = (transaction: TransactionProject) => transactions.queue.push(transaction);

export const transactionDocument = (transaction: TransactionDocument, documentId: DocumentId = getSelectedId()) => {
    transactionProject((project) => {
        const documentIndex = project.documents.findIndex((value) => value.id === documentId);
        project.documents[documentIndex] = transaction(getDocument(documentId));
        return project;
    })
}

export const transactionEntries = (transaction: TransactionEntries, documentId: DocumentId = getSelectedId()) => {
    transactionDocument((document) => {
        document.entries = transaction(document.entries)
        return document;
    }, documentId);
}

export const runTransactions = (project: Project, transactions: TransactionProject[]): TransactionProject[] => {
    if (transactions.length === 0) {
        return []
    }

    const [transaction, ...remainingTransactions] = transactions;

    const projectMutated = transaction(project);

    if (transactions.length === 0) {
        return remainingTransactions;
    }

    return runTransactions(projectMutated, remainingTransactions);
}