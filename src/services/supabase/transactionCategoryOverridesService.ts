import {Category} from "../../common/enums/Category";
import {supabase} from "./supabaseClient";

let _isCategoryByTransactionIdLoaded = false;
let _loadCategoryByTransactionIdPromise: Promise<void> | null = null;
let _categoryByTransactionId: Record<string, Category> = {};

async function loadCategoryByTransactionIdIfNeeded(): Promise<void> {
    if (_isCategoryByTransactionIdLoaded) return;

    if (_loadCategoryByTransactionIdPromise) return _loadCategoryByTransactionIdPromise; // another call is already loading

    _loadCategoryByTransactionIdPromise = (async () => {
        const { data, error } = await supabase
            .from('transaction_category_overrides')
            .select('transaction_id, category');

        if (error) {
            console.error('Failed to load transaction_category_overrides:', error);
            _loadCategoryByTransactionIdPromise = null; // allow retry
            return;
        }

        _categoryByTransactionId = data.reduce((map: Record<string, Category>, row) => {
            if (row.transaction_id && Object.values(Category).includes(row.category)) {
                map[row.transaction_id] = row.category as Category;
            }
            return map;
        }, {});

        _isCategoryByTransactionIdLoaded = true;
        _loadCategoryByTransactionIdPromise = null; // cleanup
    })();

    return _loadCategoryByTransactionIdPromise;
}

export async function getCategoryByTransactionId(date: string, vendor: string, amount: number): Promise<Category | undefined> {
    await loadCategoryByTransactionIdIfNeeded();
    return _categoryByTransactionId[`${date}-${vendor}-${amount}`];
}

export async function getTransactionIdCategoryMap(): Promise<Record<string, Category>> {
    await loadCategoryByTransactionIdIfNeeded();
    return _categoryByTransactionId;
}

export async function setCategoryByTransactionId(date: string, vendor: string, amount: number, category: Category): Promise<void> {
    const transaction_id =`${date}-${vendor}-${amount}`;
    const { error } = await supabase
        .from('transaction_category_overrides')
        .upsert([{ transaction_id, category }]);

    if (error) {
        console.error('Failed to save vendor-category mapping:', error);
        throw error;
    }

    _categoryByTransactionId[transaction_id] = category;
}
