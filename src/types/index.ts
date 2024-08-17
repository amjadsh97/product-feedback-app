export interface User {
  image: string;
  name: string;
  username: string;
}

export interface Comment {
  id?: number;
  content: string;
  user: User;
  replies?: Comment[];
  replyingTo?:string
}

export interface IProductRequest {
  id?: number;
  title: string;
  category: string;
  upvotes: number;
  status?: string;
  description: string;
  comments: Comment[];
  userUpvoted?: boolean; // Optional to avoid issues when mapping over initial data
}

export interface AppState {
  currentUser: User;
  productRequests: IProductRequest[];
}

export interface AppContextProps {
  state: AppState;
  addSuggestion: (productRequest: IProductRequest) => void;
  editSuggestion: (id: number, updatedSuggestion: Partial<IProductRequest>) => void;
  updateUpvotes: (id: number) => void;
  replyToComment: (suggestionId: number, commentId: number, reply: Comment) => void;
  removeSuggestion: (id: number) => void;
}

