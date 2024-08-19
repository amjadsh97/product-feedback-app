import Button from "../Button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSuggestions } from "../../context/AppContext.tsx"; // Import your context to use for submission

const CreateProductRequestPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "Feature",
    detail: ""
  });

  const [errors, setErrors] = useState({
    title: "",
    detail: ""
  });

  const { addSuggestion } = useSuggestions(); // Assuming you have a function in your context to add a new request
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: "" // Clear the error message when the user starts typing
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", detail: "" };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
      isValid = false;
    }

    if (!formData.detail.trim()) {
      newErrors.detail = "Detail is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Create a new product request object
      const newProductRequest = {
        id: Date.now(), // Generate a unique ID for the new request
        title: formData.title,
        category: formData.category.toLowerCase(),
        description: formData.detail,
        upvotes: 0,
        status: "suggestion", // Set a default status
        comments: []
      };

      // Add the new product request to the context or send it to the backend
      addSuggestion(newProductRequest);

      // Navigate back to the home page or another page
      navigate("/");
    }
  };

  return (
    <div className='product-request-page create-update-page'>
      <div className="buttons">
        <Button onClick={() => navigate("/")} label={"Go back"} bg={""} icon={"../public/assets/shared/icon-arrow-left.svg"} className='go-back-button'/>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <h1 className='h1-style'>Create New Feedback</h1>

        <div className="input-wrapper">
          <label className='h4-style' htmlFor="title">Feedback Title</label>
          <span className="hint">Add a short, descriptive headline</span>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          {errors.title && <span className='error'>{errors.title}</span>}
        </div>

        <div className="input-wrapper">
          <label className='h4-style' htmlFor="category">Category</label>
          <span className="hint">Choose a category for your feedback</span>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className='select'
          >
            <option value="Feature">Feature</option>
            <option value="UI">UI</option>
            <option value="UX">UX</option>
            <option value="Enhancement">Enhancement</option>
            <option value="Bug">Bug</option>
          </select>
        </div>

        <div className="input-wrapper">
          <label className='h4-style' htmlFor="detail">Feedback Detail</label>
          <span className="hint">Include any specific comments on what should be improved, added, etc.</span>
          <textarea
            id="detail"
            name="detail"
            value={formData.detail}
            onChange={handleInputChange}
          />
          {errors.detail && <span className='error'>{errors.detail}</span>}
        </div>

        <div className="buttons-form">
          <Button label={"Cancel"} bg={"var(--deep-indigo)"} onClick={() => navigate("/")}/>
          <Button label={"Add feedback"} bg={"var(--vivid-magenta)"} type="submit"/>
        </div>

      </form>
    </div>
  );
};

export default CreateProductRequestPage;
