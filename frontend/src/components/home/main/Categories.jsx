import { ListGroup, Nav } from "react-bootstrap";
import { useState, useEffect } from "react";
import { getCategories } from "../../../api/categories";

const Categories = ({ setCategory, category }) => {
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
    // <Nav className="flex-column w-100 bg-secondary">
    //   {categories.map((category) => (
    //     <Nav.Link
    //       className={({ isActive }) =>
    //         `text-decoration-none py-3 px-4 nav-link${
    //           isActive ? " active bg-primary" : ""
    //         }`
    //       }
    //       onClick={() => setCategory(category)}
    //     >
    //       {category.name}
    //     </Nav.Link>
    //   ))}
    // </Nav>
    <ListGroup className="flex-column w-100">
      {categories.map((item) => (
        <ListGroup.Item
          key={item.id}
          action
          onClick={() => setCategory(item)}
          style={{
            backgroundColor:
              category && category.id === item.id
                ? "var(--bs-primary)"
                : "var(--bs-secondary)",
            color: "var(--bs-white)",
            "--bs-list-group-action-hover-color": "initial",
          }}
        >
          {item.name}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default Categories;
