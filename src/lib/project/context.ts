import { createContext } from 'svelte';
import type { Document } from './document';

export const [getSelectedDocumentContext, setSelectedDocumentContext] = createContext<() => Document>();