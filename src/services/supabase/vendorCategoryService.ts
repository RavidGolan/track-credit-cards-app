import { supabase } from './supabaseClient';
import { Category } from '../../common/enums/Category';

// region category by vendor

let _isLoaded = false;
let _loadPromise: Promise<void> | null = null;
let _categoryByVendor: Record<string, Category> = {};

async function loadIfNeeded(): Promise<void> {
    if (_isLoaded) return;

    if (_loadPromise) return _loadPromise; // another call is already loading

    _loadPromise = (async () => {
        const { data, error } = await supabase
            .from('vendor_category_map')
            .select('vendor, category');

        if (error) {
            console.error('Failed to load vendor-category map:', error);
            _loadPromise = null; // allow retry
            return;
        }

        _categoryByVendor = data.reduce((map: Record<string, Category>, row) => {
            if (row.vendor && Object.values(Category).includes(row.category)) {
                map[row.vendor] = row.category as Category;
            }
            return map;
        }, {});

        _isLoaded = true;
        _loadPromise = null; // cleanup
    })();

    return _loadPromise;
}

export async function getCategoryByVendor(vendor: string): Promise<Category | undefined> {
    await loadIfNeeded();
    return _categoryByVendor[vendor];
}

export async function getCategoryByVendorMap(): Promise<Record<string, Category>> {
    await loadIfNeeded();
    return _categoryByVendor;
}

export async function setVendorCategory(vendor: string, category: Category): Promise<void> {
    const { error } = await supabase
        .from('vendor_category_map')
        .upsert([{ vendor, category }]);

    if (error) {
        console.error('Failed to save vendor-category mapping:', error);
        throw error;
    }

    _categoryByVendor[vendor] = category;
}

// endregion category by vendor
