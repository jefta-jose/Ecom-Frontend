"use client";
import { useEffect, useState } from "react";
import { config } from "../../config";
import ProductCard from "./ProductCard";
import ReactPaginate from "react-paginate";
import { useGetProductsQuery } from "@/redux/productsSlice";

const Items = ( {currentItems}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {currentItems &&
        currentItems?.map((item) => (
          <ProductCard key={item?._id} item={item} />
        ))}
    </div>
  );
};

const Pagination = () => {
  const [products, setProducts] = useState([]);
  const {data , isLoading} = useGetProductsQuery();
  

  useEffect(() => {
    const fetchData = async () => {
      const endpoint = `${config?.baseUrl}/products`;
      try {
            setProducts(data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    if(!isLoading){
      fetchData();
    }
  }, [isLoading , data]);
  
  const itemsPerPage = 10;
  const [itemOffset, setItemOffset] = useState(0);
  const [itemStart, setItemStart] = useState(1);
  const endOffset = itemOffset + itemsPerPage;
  // console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    const newStart = newOffset + 1;
    // console.log(
    //   `User requested page number ${event.selected}, which is offset ${newOffset}`
    // );
    setItemOffset(newOffset);
    setItemStart(newStart);
  };

  return (
    <>
      <Items currentItems={currentItems} />
      <div className="flex flex-col md:flex-row justify-center md:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold py-10"
          activeClassName="bg-black text-white"
        />
        <p>
          Products from {itemStart} to {Math.min(endOffset, products?.length)}
        </p>
      </div>
    </>
  );
};

export default Pagination;
