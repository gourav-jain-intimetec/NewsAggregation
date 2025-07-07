export class AdminCategoryService {
    constructor(private fetchFn: typeof fetch = fetch) {}

    async addCategory(categoryName: string): Promise<number> {
        try {
            const res = await this.fetchFn(`${process.env.BASE_API_URL}/category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ category_name: categoryName }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            return json.data as number;
        } catch (error) {
            throw new Error('Failed to add category. ' + (error instanceof Error ? error.message : ''));
        }
    }
} 
