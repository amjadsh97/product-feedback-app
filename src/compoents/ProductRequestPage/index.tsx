import {useNavigate, useParams} from "react-router-dom";
import { useSuggestions } from "../../context/AppContext.tsx";
import Button from "../Button";
import ProductRequest from "../ProductRequest";
import { Comment, User } from "../../types";
import { useState } from "react";

function ProductRequestPage() {
  const { id } = useParams<{ id: string }>();
  const { state, replyToComment, updateUpvotes } = useSuggestions();
  const [replyingTo, setReplyingTo] = useState<number | null>(null); // Track the comment/reply being replied to
  const [replyContent, setReplyContent] = useState(""); // Track the content of the reply
  const item = state.productRequests.find((productRequest) => productRequest.id === parseInt(id!));
  const currentUser: User = state.currentUser;

  if (!item) {
    return <div>ProductRequest not found!</div>;
  }

  const handleReplyClick = (commentId: number) => {
    setReplyingTo(commentId);
  };

  const findCommentById = (comments: Comment[], id: number): Comment | null => {
    for (const comment of comments) {
      if (comment.id === id) {
        return comment;
      } else if (comment.replies && comment.replies.length > 0) {
        const nestedComment = findCommentById(comment.replies, id);
        if (nestedComment) return nestedComment;
      }
    }
    return null;
  };

  const handleAddReply = () => {
    if (replyingTo !== null && replyContent.trim()) {
      const reply: Comment = {
        id: Date.now(), // Unique ID for the reply
        content: replyContent,
        user: currentUser,
        replies: [],
        replyingTo: findCommentById(item.comments, replyingTo)?.user.username, // Set replyingTo for nested replies
      };

      // @ts-ignore
      replyToComment(item.id, replyingTo, reply);
      setReplyContent(""); // Clear the input field after adding the reply
      setReplyingTo(null); // Hide the form after submitting the reply
    }
  };

  const CommentComponent = ({ user, content, replies, replyingTo, id }: Comment) => {
    return (
      <div className={`comment ${replies && replies.length > 0 ? "has-replies" : ""}`}>
        <div className="image-wrapper">
          <img src={"../" + user.image} alt="" />
        </div>
        <div className="comment-info">
          <div className="comment-row">
            <div className="column">
              <h3 className="full-name h4-style">{user.name}</h3>
              <div className="username h4-style">@{user.username}</div>
            </div>
            <Button className='reply-button' label="Reply" onClick={() => handleReplyClick(id)} />
          </div>
          <p className="comment-description">
            {replyingTo && <strong className="replying-to">@{replyingTo} </strong>}
            {content}
          </p>
        </div>
        {replies && replies.length > 0 && (
          <div className="replies">
            {replies.map((reply, index) => (
              <CommentComponent
                key={index}
                user={reply.user}
                content={reply.content}
                replyingTo={reply.replyingTo}
                replies={reply.replies || []}
                id={reply.id}
              />
            ))}
          </div>
        )}
      </div>
    );
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navigate = useNavigate();

  return (
    <div className='product-request-page'>
      <div className="buttons">
        <Button label={"Go back"} bg={""} icon={"../public/assets/shared/icon-arrow-left.svg"} className='go-back-button' onClick={() => navigate(`/`)}/>
        <Button className='feedback' label={"Edit Feedback"} bg={"var(--vibrant-blue)"}  onClick={() => navigate(`/update-product-request/${id}`)}/>
      </div>

      {item && (
        <ProductRequest
          id={item.id}
          upvotes={item.upvotes}
          description={item.description}
          category={item.category}
          title={item.title}
          comments={item.comments}
          onUpvote={updateUpvotes}
          userUpvoted={item.userUpvoted || false} // Pass the userUpvoted state
        />
      )}

      <div className="comments-section">
        <h3 className='section-title'>{item && item.comments.length} <span>Comments</span></h3>
        {item && item.comments.map((comment: Comment) => (
          <>
            <CommentComponent
              id={comment.id}
              replies={comment.replies || []}
              content={comment.content}
              user={comment.user}
              replyingTo={comment.replyingTo}
            />
            {replyingTo === comment.id && (
              <form action="" className="form">
                <h3 className='h3-style'>Add Comment</h3>
                <textarea
                  placeholder={'Type your reply here'}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                />
                <div className="form-row">
                  <span className="char-left body-l">250 Characters left</span>
                  <Button label={"Post Comment"} bg={"var(--vivid-magenta)"} onClick={handleAddReply} />
                </div>
              </form>
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default ProductRequestPage;
