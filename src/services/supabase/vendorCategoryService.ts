import { supabase } from './supabaseClient';
import { Category } from '../../common/enums/Category';

let _vendorCategoryMap: Record<string, Category> = {};
let _isLoaded = false;
let _loadPromise: Promise<void> | null = null;

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

        _vendorCategoryMap = data.reduce((map: Record<string, Category>, row) => {
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

export async function getVendorCategory(vendor: string): Promise<Category | undefined> {
    await loadIfNeeded();
    return _vendorCategoryMap[vendor];
}

export async function getVendorCategoryMap(): Promise<Record<string, Category>> {
    await loadIfNeeded();
    return _vendorCategoryMap;
}

export async function setVendorCategory(vendor: string, category: Category): Promise<void> {
    const { error } = await supabase
        .from('vendor_category_map')
        .upsert([{ vendor, category }]);

    if (error) {
        console.error('Failed to save vendor-category mapping:', error);
        throw error;
    }

    _vendorCategoryMap[vendor] = category;
}
