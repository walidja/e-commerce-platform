import { ListGroup, Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getCategories } from "../../../api/categories";
import { NavLink } from "react-router-dom";

const Categories = ({ setCategory }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Nav className="flex-column w-100 " variant="dark">
      {categories.map((category) => (
        <Nav.Item key={category.id}>
          <NavLink
            className={({ isActive }) =>
              `text-decoration-none py-3 px-4 text-white nav-link${
                isActive ? " active" : ""
              }`
            }
            onClick={() => setCategory(category)}
          >
            {category.name}
          </NavLink>
        </Nav.Item>
      ))}
    </Nav>
  );
};

export default Categories;
