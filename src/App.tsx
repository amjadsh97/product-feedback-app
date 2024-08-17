import iconSuggestions from "../public/assets/suggestions/icon-suggestions.svg"
import "./reset.css"
import './App.css'
import Button from "./compoents/Button";
import {useSuggestions} from "./context/AppContext.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route, useNavigate,
} from "react-router-dom";
import ProductRequestPage from "./compoents/ProductRequestPage";
import ProductRequest from "./compoents/ProductRequest";
import CreateProductRequestPage from "./compoents/CreateProductRequestPage";
import UpdateProductRequestPage from "./compoents/UpdateProductRequestPage/UpdateProductRequestPage.tsx";
import RoadmapPage from "./compoents/RoadmapPage";
import {useEffect, useRef, useState} from "react";
import SortDropdown from "./compoents/Sort";

function App() {
  const {state, updateUpvotes} = useSuggestions();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(state.productRequests.map(productRequest => productRequest.category)));

  const filteredProductRequests = selectedCategory
    ? state.productRequests.filter(productRequest => productRequest.category === selectedCategory)
    : state.productRequests;

  const roadmap = Object.entries(
    state.productRequests.reduce((acc, productRequest) => {

      // @ts-ignore
      acc[productRequest.status] = (acc[productRequest.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({status, count}));


  const AppInner = () => {
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState("Most Upvotes");
    const [isNavMobileOpened, setIsNavMobileOpened] = useState(false)
    const tagsElement = useRef<HTMLDivElement | null>(null)
    const roadmapElement = useRef<HTMLDivElement | null>(null);
    const navMobile = useRef<HTMLDivElement | null>(null);

    const sortedProductRequests = [...filteredProductRequests].sort((a, b) => {
      switch (sortOption) {
        case "Most Upvotes":
          return b.upvotes - a.upvotes;
        case "Least Upvotes":
          return a.upvotes - b.upvotes;
        case "Most Comments":
          return (b.comments?.length || 0) - (a.comments?.length || 0);
        case "Least Comments":
          return (a.comments?.length || 0) - (b.comments?.length || 0);
        default:
          return 0;
      }
    });

    const handleCategoryClick = (category: string | null) => {
      setSelectedCategory(category);
    };

    useEffect(() => {
      if (window.innerWidth < 768 && navMobile.current && tagsElement.current && roadmapElement.current) {
        navMobile.current.append(tagsElement.current);
        navMobile.current.append(roadmapElement.current);
      }
    }, []);

    useEffect(() => {
      const bodyElem = document.querySelector("body")
      if (isNavMobileOpened && bodyElem){
        return bodyElem.classList.add("nav-mobile-opened");
      }
      if (!isNavMobileOpened && bodyElem){
        return bodyElem.classList.remove("nav-mobile-opened");
      }
    }, [isNavMobileOpened]);

    return (
      <>
        <aside className='aside'>
          <div className="aside-header">
            <h2 className='h2-style'>Frontend Mentor</h2>
            <p className='body-m'>Feedback Board</p>
          </div>
          <span className={`menu ${isNavMobileOpened ? "opened" : ""}`}
                onClick={() => setIsNavMobileOpened(prev => !prev)}>
              <span className="line"></span>
            </span>
          <div ref={tagsElement} className="tags-container">
            <span className={`tag ${selectedCategory == undefined ? "active" : ""}`}
                  onClick={() => handleCategoryClick(null)}>All</span>
            {categories.map((category) => (
              <span className={`tag ${category === selectedCategory ? "active" : ""}`} key={category}
                    onClick={() => handleCategoryClick(category)}>
                {category}
              </span>
            ))}
          </div>
          <div ref={roadmapElement} className="roadmap-wrapper">
            <div className="roadmap-header">
              <h3 className='h3-style'>Roadmap</h3>
              <button onClick={() => navigate("/roadmap")}>View</button>
            </div>
            <ul className="list">
              {roadmap.map(item => (
                <li className="item" key={item.status}>
                  <span className='item-title'>{item.status}</span>
                  <span className='item-count'>{item.count as any}</span>
                </li>
              ))}
            </ul>
          </div>
          <div ref={navMobile} className="nav-mobile"></div>
        </aside>
        <div className="main-content">
          <div className="main-content-header">
            <img src={iconSuggestions} alt="icon suggestions"/>
            <h3 className='h3-style'>{filteredProductRequests.length} Suggestions</h3>
            <div className="sort-menu">
              <SortDropdown sortOption={sortOption} setSortOption={setSortOption}/>
            </div>
            <Button onClick={() => navigate("/create-product-request")} className='add-button' label={"Add Feedback"}
                    icon={"public/assets/shared/icon-plus.svg"}
                    bg={"var(--vivid-magenta)"}/>
          </div>
          <div className="suggestions">
            {sortedProductRequests.map((product) => (
              <ProductRequest
                onUpvote={updateUpvotes}
                id={product.id}
                upvotes={product.upvotes}
                description={product.description}
                category={product.category}
                title={product.title} comments={product.comments}
                userUpvoted={product.userUpvoted || false} // Pass the userUpvoted state
              />
            ))}

          </div>
        </div>
      </>
    )
  }

  return (
    <div className='app'>
      <header></header>
      <main>
        <Router>
          <Routes>
            <Route path="/" element={<AppInner/>}/>
            <Route path="/productRequest/:id" element={<ProductRequestPage/>}/>
            <Route path="/create-product-request" element={<CreateProductRequestPage/>}/>
            <Route path="/update-product-request/:id" element={<UpdateProductRequestPage/>}/>
            <Route path="/roadmap" element={<RoadmapPage/>}/>
          </Routes>
        </Router>
      </main>
      <footer></footer>

    </div>
  )
}

export default App
