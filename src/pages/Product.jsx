import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../ui/Loading";
import Container from "../ui/Container";
import PriceTag from "../ui/PriceTag";
import { MdOutlineStarOutline } from "react-icons/md";
import { FaRegEye } from "react-icons/fa";
import FormattedPrice from "../ui/FormattedPrice";
import { IoClose } from "react-icons/io5";
import AddToCartBtn from "../ui/AddToCartBtn";
import { productPayment } from "../assets";
import ProductCard from "../ui/ProductCard";
import CategoryFilters from "../ui/CategoryFilters";
import _ from "lodash";
import { getUserRole } from "../lib/localStore";
import AdminCreateProduct from "../ui/AdminCreateProduct";
import { useGetProductByIdQuery, useGetProductsQuery } from "@/redux/productsSlice";

const Product = () => {
  const [productData, setProductData] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState("");
  const [color, setColor] = useState("");
  const { id } = useParams();

  const [addProductModal , setAddProductModal] = useState(false);

  const {data: Products} = useGetProductsQuery();
  const {data: singleProduct} = useGetProductByIdQuery(id);

    useEffect(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
  
          if (id) {
            setProductData(singleProduct);
            setAllProducts([]);
          } else {
            setAllProducts(Products);
            setProductData(null);
          }
        } catch (error) {
          console.error("Error fetching data", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, [id , singleProduct, Products]); // Only depend on `id`, `endpoint` is unnecessary here

  useEffect(() => {
    if (productData) {
      setImgUrl(productData?.images[0]);
      setColor(productData?.colors[0]);
    }
  }, [productData]);

  const userRole = getUserRole();

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <Container>
          {!!id && productData && _.isEmpty(allProducts) ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="flex-col gap-4 mx-auto">
              <div className="flex items-center justify-center max-w-lg border border-gray-200 rounded-md overflow-hidden w-[18rem] h-[18rem] sm:w-[24rem] sm:h-[24rem] md:w-[27rem] md:h-[27rem] lg:w-[30rem] lg:h-[30rem]">
                <img
                  src={imgUrl}
                  alt="mainImage"
                  className="w-full h-full object-contain p-3" // Image adjusts to fit container
                />
              </div>

              {/* Thumbnail section */}
              <div className="flex gap-2 mt-2 flex-wrap justify-center">
                {productData?.images?.map((item, index) => (
                  <img
                    src={item}
                    alt="img"
                    key={index}
                    className={`w-10 h-10 sm:w-14 sm:h-14 md:h-16 md:w-16 lg:w-20 lg:h-20 cursor-pointer opacity-80 hover:opacity-100 duration-300 mt-2 rounded-full object-cover ${
                      imgUrl === item && "border border-gray-500 rounded-sm opacity-100"
                    }`}
                    onClick={() => setImgUrl(item)}
                  />
                ))}
              </div>
            </div>

              <div className="flex flex-col gap-4">
                <h2 className="text-3xl font-bold">{productData?.name}</h2>
                <div className="flex items-center justify-between">
                  <PriceTag
                    regularPrice={productData?.regularPrice}
                    discountedPrice={productData?.discountedPrice}
                    className="text-xl flex-col lg:flex-row"
                  />
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-base text-lightText flex items-center">
                      <MdOutlineStarOutline />
                      <MdOutlineStarOutline />
                      <MdOutlineStarOutline />
                      <MdOutlineStarOutline />
                      <MdOutlineStarOutline />
                    </div>
                    <p className="text-base font-semibold">{`(${productData?.reviews} reviews)`}</p>
                  </div>
                </div>
                <p className="flex items-center text-sm md:text-lg">
                  <FaRegEye className="mr-1" />{" "}
                  <span className="font-semibold mr-1">
                    {productData?.reviews}
                  </span>{" "}
                  peoples are viewing this right now
                </p>
                <p>
                  You are saving{" "}
                  <span className="text-base font-semibold text-green-500">
                    <FormattedPrice
                      amount={
                        productData?.regularPrice -
                        productData?.discountedPrice
                      }
                    />
                  </span>{" "}
                  upon purchase
                </p>
                <div>
                  {color && (
                    <p>
                      Color:{" "}
                      <span
                        className="font-semibold capitalize"
                        style={{ color: color }}
                      >
                        {color}
                      </span>
                    </p>
                  )}
                  <div className="flex items-center gap-x-3">
                    {productData?.colors.map((item) => (
                      <div
                        key={item}
                        className={`${
                          item === color
                            ? "border border-black p-1 rounded-full"
                            : "border-transparent"
                        }`}
                      >
                        <div
                          className="w-10 h-10 rounded-full cursor-pointer"
                          style={{ backgroundColor: item }}
                          onClick={() => setColor(item)}
                        />
                      </div>
                    ))}
                  </div>
                  {color && (
                    <button
                      onClick={() => setColor("")}
                      className="font-semibold mt-1 flex items-center gap-1 hover:text-red-600 duration-200"
                    >
                      <IoClose /> Clear
                    </button>
                  )}
                </div>
                <p>
                  Brand:{" "}
                  <span className="font-medium">{productData?.brand}</span>
                </p>
                <p>
                  Category:{" "}
                  <span className="font-medium">{productData?.category}</span>
                </p>
                <AddToCartBtn
                  product={productData}
                  title="Buy now"
                  className="bg-black/80 py-3 text-base text-gray-200 hover:scale-100 hover:text-white duration-200"
                />
                <div className="bg-[#f7f7f7] p-5 rounded-md flex flex-col items-center justify-center gap-2">
                  <img
                    src={productPayment}
                    alt="payment"
                    className="w-auto object-cover"
                  />
                  <p className="font-semibold">
                    Guaranteed safe & secure checkout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-10">
              <CategoryFilters id={id} />
              <div>
                <p className="text-4xl font-semibold mb-5 text-center">
                  Products Collection
                </p>

                <div className={userRole === "admin" ? "visible" : "hidden"}>
                <button
                  onClick={() => setAddProductModal(true)}
                  className="px-4 py-2 my-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
                >
                  Add Product
                </button>
                {addProductModal && <AdminCreateProduct setAddProductModal={setAddProductModal} />}
                </div>


                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {allProducts?.map((item) => (
                    <ProductCard item={item} key={item?._id} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </Container>
      )}
    </div>
  );
};

export default Product;
