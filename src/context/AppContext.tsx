import React, {createContext, useState, useEffect, useContext} from 'react';
import data from "../data.json";
import {AppContextProps, AppState, IProductRequest} from "../types";
// Define the types for your data
interface User {
  image: string;
  name: string;
  username: string;
}

interface Comment {
  id: number;
  content: string;
  user: User;
  replies?: Comment[];
}





const AppContext = createContext<AppContextProps | undefined>(undefined);

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: AppState = {
    currentUser: data.currentUser,
    productRequests: data.productRequests as IProductRequest[],
  };

  const [state, setState] = useState<AppState>(() => {
    if (localStorage.getItem("appState")) {
      return JSON.parse(localStorage.getItem("appState") as string);
    }
    return initialState;
  });

  // Load initial state from localStorage
  useEffect(() => {
    const storedState = localStorage.getItem('appState');
    if (storedState) {
      setState(JSON.parse(storedState));
    } else {
      // If no stored state, populate with data.json content
      // Assuming you have loaded your initial data from data.json elsewhere
      setState(initialState);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appState', JSON.stringify(state));
  }, [state]);

  // Add productRequest
  const addSuggestion = (productRequest: IProductRequest) => {
    setState(prevState => ({
      ...prevState,
      productRequests: [...prevState.productRequests, productRequest],
    }));
  };

  // Edit productRequest
  const editSuggestion = (id: number, updatedSuggestion: Partial<IProductRequest>) => {
    setState(prevState => ({
      ...prevState,
      productRequests: prevState.productRequests.map(productRequest =>
        productRequest.id === id ? { ...productRequest, ...updatedSuggestion } : productRequest
      ),
    }));
  };


  const removeSuggestion = (id: number) => {
    setState(prevState => ({
      ...prevState,
      productRequests: prevState.productRequests.filter(productRequest => productRequest.id !== id),
    }));
  };

  // Update upvotes
  const updateUpvotes = (id: number) => {
    setState(prevState => {
      const updatedProductRequests = prevState.productRequests.map(productRequest => {
        if (productRequest.id === id) {
          const userHasUpvoted = productRequest.userUpvoted; // Check if the user has already upvoted
          console.log({userHasUpvoted})
          return {
            ...productRequest,
            upvotes: userHasUpvoted ? productRequest.upvotes - 1 : productRequest.upvotes + 1,
            userUpvoted: !userHasUpvoted, // Toggle the upvoted state
          };
        }
        return productRequest;
      });

      return {
        ...prevState,
        productRequests: updatedProductRequests,
      };
    });
  };


  // Reply to comment
  // Context file
  const replyToComment = (suggestionId: number, commentId: number, reply: Comment) => {
    const addReplyToComment = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: comment.replies
              ? [...comment.replies, reply]
              : [reply],
          };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: addReplyToComment(comment.replies),
          };
        }
        return comment;
      });
    };

    setState((prevState) => ({
      ...prevState,
      productRequests: prevState.productRequests.map((productRequest) =>
        productRequest.id === suggestionId
          ? {
            ...productRequest,
            comments: addReplyToComment(productRequest.comments || []),
          }
          : productRequest
      ),
    }));
  };


  return (
    <AppContext.Provider
      value={{
        state,
        addSuggestion,
        editSuggestion,
        updateUpvotes,
        removeSuggestion,
        replyToComment,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useSuggestions = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useSuggestions must be used within a SuggestionsProvider');
  }
  return context;
};

export { AppProvider, AppContext, useSuggestions };
