import { INewsFetcher } from '../interfaces/INewsFetcher';
import { NewsApiFetcher } from '../sources/newsApiFetcher';
import { TheNewsApiFetcher } from '../sources/theNewsApiFetcher';

const fetcherConstructors: Record<string, new () => INewsFetcher> = {
    newsapi: NewsApiFetcher,
    thenewsapi: TheNewsApiFetcher,
};

export function getFetcher(source: string): INewsFetcher {
    const fetcher = fetcherConstructors[source.toLowerCase()];
    if (!fetcher) {
        throw new Error(`Unknown news source: ${source}`);
    }
    return new fetcher();
}

export function availableSources(): string[] {
    return Object.keys(fetcherConstructors);
}
