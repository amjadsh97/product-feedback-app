import {useNavigate, useParams} from "react-router-dom";
import {useSuggestions} from "../../context/AppContext.tsx";
import Button from "../Button";
import ProductRequest from "../ProductRequest";
import {Comment, User} from "../../types";
import {useEffect, useRef, useState} from "react";

function ProductRequestPage() {
  const {id} = useParams<{ id: string }>();
  const {state, replyToComment, updateUpvotes} = useSuggestions();
  const [replyingTo, setReplyingTo] = useState<number | null>(null); // Track the comment/reply being replied to
  const [replyContent, setReplyContent] = useState(""); // Track the content of the reply
  const item = state.productRequests.find((productRequest) => productRequest.id === parseInt(id!));
  const currentUser: User = state.currentUser;
  const navigate = useNavigate();

  if (!item) {
    return <div>ProductRequest not found!</div>;
  }

  const handleReplyClick = (commentId?: number) => {
    if (commentId !== undefined) {
      setReplyingTo(commentId);
    }
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

  const CommentComponent = ({user, content, replies, replyingTo, id}: Comment) => {
    const commentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const commentElement = commentRef.current;
      const lineElem = document.querySelector(".comment-line");
      if (lineElem) return;

      if (commentElement && replies && replies.length > 0) {
        // Find the last reply element
        const lastReply = commentElement.querySelector('.comment:last-of-type');


        if (lastReply) {
          const line = document.createElement('div');
          line.classList.add('comment-line');
          line.style.position = 'absolute';
          line.style.left = '20px';
          line.style.width = '1px';
          line.style.background = 'hsl(from var(--soft-lavender) h s l / 0.1)';
          line.style.transform = 'translateY(60px)';

          // Calculate height from top of the comment to the bottom of the last reply's avatar
          const commentTop = commentElement.getBoundingClientRect().top;
          const lastReplyBottom = lastReply.querySelector('.image-wrapper')?.getBoundingClientRect().bottom;

          if (lastReplyBottom) {
            line.style.height = `${lastReplyBottom - commentTop - 80}px`; // Set the dynamic height
          }

          commentElement.appendChild(line);
        }
      }
    }, [replies]);

    return (
      <div ref={commentRef} className={`comment ${replies && replies.length > 0 ? "has-replies" : ""}`}>
        <div className="image-wrapper">
          <img src={"../" + user.image} alt=""/>
        </div>
        <div className="comment-info">
          <div className="comment-row">
            <div className="column">
              <h3 className="full-name h4-style">{user.name}</h3>
              <div className="username h4-style">@{user.username}</div>
            </div>
            <Button className='reply-button' label="Reply" onClick={() => handleReplyClick(id)}/>
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
  useEffect(() => {
    if (innerWidth < 768) {
      document.querySelectorAll(".comment").forEach(elem => {
        const descriptionElement = elem.querySelector(".comment-description");
        if (descriptionElement) {
          elem.append(descriptionElement);
        }
      });
    }

  }, []);

  return (
    <div className='product-request-page'>
      <div className="buttons">
        <Button label={"Go back"} bg={""} icon={"../public/assets/shared/icon-arrow-left.svg"}
                className='go-back-button' onClick={() => navigate(`/`)}/>
        <Button className='feedback' label={"Edit Feedback"} bg={"var(--vibrant-blue)"}
                onClick={() => navigate(`/update-product-request/${id}`)}/>
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
                  <Button label={"Post Comment"} bg={"var(--vivid-magenta)"} onClick={handleAddReply}/>
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
