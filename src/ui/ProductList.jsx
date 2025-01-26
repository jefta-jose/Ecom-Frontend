import { Link } from "react-router-dom";
import Container from "./Container";
import Title from "./Title";
import Pagination from "./Pagination";
import { getUserRole } from "../lib/localStore";

const ProductList = () => {

  const userRole = getUserRole();
  
  return (
    <Container className={userRole === "admin" ? "hidden" : "visible"}>
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <Title text="Top Selling Products" />
          <Link to={"/product"}>View All Products</Link>
        </div>
        <div className="w-full h-[1px] bg-gray-200 mt-2" />
      </div>
      {/* Pagination */}
      <Pagination />
    </Container>
  );
};

export default ProductList;
