export interface IArticle {
    article_id: number;
    title: string;
    description: string;
    url: string;
    image_url: string;
    source: string;
    language: string;
    published_at: string;
    likes: number;
    dislikes: number;
}

export interface IExternalServer {
    serverId: number;
    name: string;
    apiKey: string;
    status: string;
    lastAccessed: string;
  }
  
export interface ICategory {
    category_id: number;
    category_name: string;
}