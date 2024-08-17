import {useNavigate} from "react-router-dom";
import Button from "../Button";
import iconComments from "../../../public/assets/shared/icon-comments.svg";
// @ts-ignore
import {IProductRequest} from "../../types";
import {useContext} from "react";
import {useSuggestions} from "../../context/AppContext.tsx";


interface ProductRequestProps extends IProductRequest {
  onUpvote: (id: number) => void;
}


const ProductRequest = ({id, title, comments, category, userUpvoted,upvotes, description, onUpvote}: ProductRequestProps) => {
  const navigate = useNavigate()
  const { state, replyToComment } = useSuggestions();

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to the detail page when upvoting
    // @ts-ignore
    onUpvote(id);
  };

  return (
    <div onClick={() => navigate(`/productRequest/${id}`)} className='productRequest'>
      <Button className={`upvote-button ${userUpvoted ? 'upvoted' : ''}`}  label={upvotes} icon={"../public/assets/shared/icon-arrow-up.svg"} onClick={handleUpvoteClick}/>
      <div className="productRequest-column">
        <h3 className="productRequest-title">{title}</h3>
        <p className="productRequest-description">{description}</p>
        <div className="tag">{category}</div>
      </div>
      <div className="comments-count"><img src={iconComments} alt="icon comments"/><span
        className='value'>{comments?.length ? comments?.length : 0}</span>
      </div>
    </div>
  )
};

export default ProductRequest;
