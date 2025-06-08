import {supabase} from "./supabaseClient";

let _isTransactionDetailsLoaded = false;
let __loadTransactionDetailsPromise: Promise<void> | null = null;
let _detailsByTransactionId: Record<string, string> = {};

async function loadCategoryByTransactionIdIfNeeded(): Promise<void> {
    if (_isTransactionDetailsLoaded) return;

    if (__loadTransactionDetailsPromise) return __loadTransactionDetailsPromise; // another call is already loading

    __loadTransactionDetailsPromise = (async () => {
        const { data, error } = await supabase
            .from('transaction_details')
            .select('transaction_id, details');

        if (error) {
            console.error('Failed to load transaction_details:', error);
            __loadTransactionDetailsPromise = null; // allow retry
            return;
        }

        _detailsByTransactionId = data.reduce((map: Record<string, string>, row) => {
            if (row.transaction_id && row.details) {
                map[row.transaction_id] = row.details;
            }
            return map;
        }, {});

        _isTransactionDetailsLoaded = true;
        __loadTransactionDetailsPromise = null; // cleanup
    })();

    return __loadTransactionDetailsPromise;
}

export async function getDetailsByTransactionId(date: string, vendor: string, amount: number): Promise<string> {
    await loadCategoryByTransactionIdIfNeeded();
    return _detailsByTransactionId[`${date}-${vendor}-${amount}`];
}

export async function getTransactionIdDetailsMap(): Promise<Record<string, string>> {
    await loadCategoryByTransactionIdIfNeeded();
    return _detailsByTransactionId;
}

export async function setDetailsByTransactionId(date: string, vendor: string, amount: number, details: string): Promise<void> {
    const transaction_id =`${date}-${vendor}-${amount}`;
    const { error } = await supabase
        .from('transaction_details')
        .upsert([{ transaction_id, details }]);

    if (error) {
        console.error('Failed to save vendor-category mapping:', error);
        throw error;
    }

    _detailsByTransactionId[transaction_id] = details;
}
