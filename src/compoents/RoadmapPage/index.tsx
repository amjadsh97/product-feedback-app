import Button from "../Button";
import { useNavigate } from "react-router-dom";
import iconComments from "../../../public/assets/shared/icon-comments.svg";
import { useSuggestions } from "../../context/AppContext.tsx";
import {useState} from "react";

const Roadmap = () => {
  const navigate = useNavigate();
  const { state } = useSuggestions();
  const [activeTab, setActiveTab] = useState<string>("suggestion"); // Default to the first tab

  // Group feedback items by their status
  const groupedFeedback = state.productRequests.reduce((acc, product) => {
    const status = product.status || "unknown"; // Fallback to "unknown" or another default status if undefined
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(product);
    return acc;
  }, {} as Record<string, typeof state.productRequests>);


  // Define status details (titles, descriptions) for each column
  const statusDetails:any = {
    suggestion: { title: "Suggestions", description: "Ideas that could be implemented" },
    planned: { title: "Planned", description: "Currently being planned for future releases" },
    "in-progress": { title: "In Progress", description: "Currently being worked on" },
    live: { title: "Live", description: "Released features" }
  };

  return (
    <div className='roadmap-page'>
      <div className="roadmap-header">
        <div className="roadmap-header__wrapper">
          <Button label={"Go back"} bg={""} icon={"../assets/shared/icon-arrow-left.svg"} className='go-back-button' onClick={() => navigate(`/`)}/>
          <h2 className='h2-style'>Roadmap</h2>
        </div>

        <Button onClick={() => navigate("/create-product-request")} className='add-button' label={"Add Feedback"} icon={"../assets/shared/icon-plus.svg"} bg={"var(--vivid-magenta)"}/>
      </div>

      {/*the tabs only on mobile*/}
      <div className="tabs">
        {Object.keys(groupedFeedback).map((status) => (
          <div
            key={status}
            className={`tab-item ${activeTab === status ? "active" : ""}`}
            onClick={() => setActiveTab(status)}
          >
            {statusDetails[status].title}
          </div>
        ))}
      </div>

      <div className="columns-wrapper">
        {Object.keys(groupedFeedback).map((status) => (
          <div className={`column ${innerWidth < 768 && activeTab === status ? "active" : "hidden"}`} key={status}>
            <h2 className="roadmap-title h3-style">{statusDetails[status].title}</h2>
            <p className="roadmap-description">{statusDetails[status].description}</p>
            <div className="cards">
              {groupedFeedback[status].map((product) => (
                <div className="card" key={product.id}>
                  <div className="card-tag">{product.status}</div>
                  <h3 className="card-title h3-style">{product.title}</h3>
                  <p className="card-description">{product.description}</p>
                  <div className="card-category">{product.category}</div>
                  <div className="card-row">
                    <Button className='upvote-button' label={String(product.upvotes)} icon={"../public/assets/shared/icon-arrow-up.svg"}/>
                    <div className="comments-count">
                      <img src={iconComments} alt="icon comments"/>
                      <span className='value'>{product?.comments?.length}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
