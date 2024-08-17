import {useState} from "react";
import arrowUp from "../../../public/assets/shared/icon-arrow-up.svg"
import arrowDown from "../../../public/assets/shared/icon-arrow-down.svg"
import "./style.css"

interface ISort {
  sortOption:string;
  setSortOption: (param:string) => void
}
const SortDropdown = ({ sortOption, setSortOption }:ISort) => {
  const options = ["Most Upvotes", "Least Upvotes", "Most Comments", "Least Comments"];
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option:string) => {
    setSortOption(option);
    setIsOpen(false);
  };

  return (
    <div className="sort-dropdown">
      <span className='arrow-wrapper' onClick={() => setIsOpen(!isOpen)}>
        Sort by: {sortOption} <span className="arrow">{isOpen ? <img src={arrowUp} alt=""/> : <img src={arrowDown} alt=""/>}</span>
      </span>
      {/*{isOpen && (*/}
        <ul className={`dropdown-menu ${isOpen ? "open":""}`}>
          {options.map((option) => (
            <li
              key={option}
              className={option === sortOption ? "selected" : ""}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      {/*)}*/}
    </div>
  );
};

export default SortDropdown