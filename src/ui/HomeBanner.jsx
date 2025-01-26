import { homeBanner } from "../assets";
import { getUserRole } from "../lib/localStore";
import Container from "./Container";
import LinkButton from "./LinkButton";

import AdminCreateCategory from "./AdminCreateCategory";
import UsersSection from "@/sections/UsersSection";
import ProductsSection from "@/sections/ProductsSection";
import HighlightedProductsSection from "@/sections/HighlightedProductsSection";
import CategorySection from "@/sections/CategorySection";


const HomeBanner = () => {
  const userRole = getUserRole();

  return (
    <div>
      <Container className="relative py-5 overflow-hidden">
        {/* Show content only if userRole is not 'admin' */}
        {userRole !== "admin" && (
          <div className="relative">
            <img
              src={homeBanner}
              alt="homeBanner"
              className="w-full h-full object-cover rounded-md"
            />
            <div className="w-full h-full absolute top-0 left-0 bg-black/10" />
            <div className="absolute inset-0 flex flex-col justify-center px-10">
              <h2 className="text-xl md:text-4xl lg:text-6xl text-whiteText font-bold">
                Mi Air Purifier
              </h2>
              <p className="text-base md:text-lg font-semibold leading-6 text-whiteText/90 max-w-[250px] pb-1">
                The new tech gift you are wishing for right here.
              </p>
              <LinkButton className="w-44 flex items-center justify-center bg-whiteText text-darkText hover:bg-darkText hover:text-whiteText duration-200 pb-2" />
            </div>
          </div>
        )}

        {/* Admin content */}
        {userRole === "admin" && (
            <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

            {/* Users Section with Pagination */}
            <UsersSection/>

            {/* Products Section */}
            <ProductsSection/>

            {/* Highlited Products Section */}
            <HighlightedProductsSection/>

            {/* Categories Section */}
            <CategorySection/>

          </div>
        )}

      </Container>
    </div>
  );
};

export default HomeBanner;
