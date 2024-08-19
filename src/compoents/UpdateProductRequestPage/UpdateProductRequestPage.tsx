import Button from "../Button";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSuggestions } from "../../context/AppContext.tsx"; // Import your context to use for updating

const UpdateProductRequestPage = () => {
  const { id } = useParams<{ id: string }>();
  const { state, editSuggestion, removeSuggestion } = useSuggestions(); // Assuming you have functions for updating and deleting
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    status: "",
    description: ""
  });



  const [errors, setErrors] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    const productRequest = state.productRequests.find((request) => request.id === parseInt(id!));
    if (productRequest) {
      setFormData({
        title: productRequest.title,
        category: productRequest.category,
        status: productRequest.status as string,
        description: productRequest.description
      });
    }
  }, [id, state.productRequests]);

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
    const newErrors = { title: "", description: "" };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Detail is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Update the product request object
      const updatedProductRequest = {
        ...formData,
        id: parseInt(id!)
      };

      // Update the product request in the context or backend
      editSuggestion(parseInt(id!), updatedProductRequest);

      // Navigate back to the home page or another page
      navigate("/");
    }
  };

  const handleDelete = () => {
    // Delete the product request from the context or backend
    removeSuggestion(parseInt(id!));

    // Navigate back to the home page or another page
    navigate("/");
  };

  return (
    <div className='product-request-page create-update-page edit'>
      <div className="buttons">
        <Button onClick={() => {
          navigate("/")
        }} label={"Go back"} bg={""} icon={"../assets/shared/icon-arrow-left.svg"} className='go-back-button'/>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <h1 className='h1-style'>Editing ‘{formData.title}’</h1>

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
            className='select'
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            required
          >
            <option value="Feature">Feature</option>
            <option value="UI">UI</option>
            <option value="UX">UX</option>
            <option value="Enhancement">Enhancement</option>
            <option value="Bug">Bug</option>
          </select>
        </div>

        <div className="input-wrapper">
          <label className='h4-style' htmlFor="status">Update Status</label>
          <span className="hint">Change feedback state</span>
          <select
            id="status"
            className='select'
            name="status"
            value={formData.status}
            onChange={handleInputChange}

          >
            <option value="suggestion">Suggestion</option>
            <option value="planned">Planned</option>
            <option value="in-progress">In Progress</option>
            <option value="live">Live</option>
          </select>
        </div>

        <div className="input-wrapper">
          <label className='h4-style' htmlFor="description">Feedback Detail</label>
          <span className="hint">Include any specific comments on what should be improved, added, etc.</span>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}

          />
          {errors.description && <span className='error'>{errors.description}</span>}
        </div>

        <div className="buttons-form update">
          <Button className='delete' label={"Delete"} bg={"var(--red)"} onClick={handleDelete}/>
          <Button label={"Cancel"} bg={"var(--deep-indigo)"} onClick={() => navigate("/")}/>
          <Button label={"Update feedback"} bg={"var(--vivid-magenta)"} type="submit"/>
        </div>

      </form>
    </div>
  );
};

export default UpdateProductRequestPage;
