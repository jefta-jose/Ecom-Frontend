import { useEffect, useState } from "react";
import Container from "./Container";
import Title from "./Title";
import { Link } from "react-router-dom";
import { getUserRole } from "../lib/localStore";
import { useGetCategoriesQuery } from "@/redux/categorySlice";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const {data , isLoading} = useGetCategoriesQuery();

  useEffect(() => {
    const fetchData = async () => {
      try {            

        setCategories(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if(!isLoading){
      fetchData();
    }
  }, [data , isLoading]);

  const userRole = getUserRole();
  
  return (
    <Container className={userRole === "admin" ? "hidden" : "visible"}>
      <div className="mb-10">
        <div className="flex items-center justify-between">
          <Title text="Popular categories" />
          <Link
            to={"/category/bedroom"}
            className="font-medium relative group overflow-hidden pr-4"
          >
             All Categories{" "}
            <span className="absolute bottom-0 left-0 w-full block h-[1px] bg-gray-600 -translate-x-[100%] group-hover:translate-x-0 duration-300" />
          </Link>
        </div>
        <div className="w-full h-[1px] bg-gray-200 mt-3" />
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-7">
        {categories.map((item) => (
          <Link
            to={`/category/${item?._base}`}
            key={item?._id}
            className="w-full h-auto relative group overflow-hidden flex flex-col items-center justify-between rounded-md border border-gray-800 py-2 "
          >
            <div className="absolute w-full text-center">
              <p className="text-sm md:text-base font-bold">{item?.name}</p>
            </div>

            <img
              src={item?.image}
              alt="categoryImage"
              className="w-10 h-auto group-hover:scale-110 duration-300 pt-12 lg:pt-6 "
            />

          </Link>
        ))}
      </div>
    </Container>
  );
};

export default Categories;