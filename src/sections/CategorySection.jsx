import AdminCreateCategory from "@/ui/AdminCreateCategory";
import { useEffect, useState } from "react";
import AdminUpdateCategory from "./AdminUpdateCategory";
import { useGetCategoriesQuery , useDeleteCategoryMutation } from "@/redux/categorySlice";

const CategorySection = () => {
  const [allCategories , setallCategories] = useState([]);
  const [addCategoryModal , setAddCategoryModal] = useState(false);
  const {data} = useGetCategoriesQuery();
  const [deleteCategory] = useDeleteCategoryMutation();


  const ITEMS_PER_PAGE = 5; // Define items per page
  // States for pagination
  const [categoryPage, setCategoryPage] = useState(1);
  // Helper function to paginate data
  const paginate = (data, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };
  // Paginated data
  const paginatedCategories = paginate(allCategories, categoryPage);
  // Total pages for each dataset
  const totalCategoryPages = Math.ceil(allCategories.length / ITEMS_PER_PAGE);

  useEffect(() => {
      const fetchAllCategories = async () => {
      try {
        if(data){
          setallCategories(data);
        }
        }
      catch (error) {
          console.error("Error fetching data", error);
      }
      };
  
      fetchAllCategories();
  
  },[data]);

  const handleDeletingCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
    } catch (error) {
      console.log("Error deleting document", error);
    }
  };

  const [updateCategoryModal , setUpdateCategoryModal] = useState(false);
  const [categoryObject , setCategoryObject] = useState({});

  const populateCategoryObject = (categoryObj)=>{
    setCategoryObject(categoryObj);
    setUpdateCategoryModal(true);
  }


  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">

    <div className=" flex items-center gap-x-2">
    <h2 className="md:text-2xl font-bold text-indigo-600 mb-4">{allCategories.length}</h2>
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Categories</h2>
    </div>


    <button
      onClick={() => setAddCategoryModal(true)}
          className="px-4 py-2 my-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
        >
          Add Category
        </button>
        {addCategoryModal && <AdminCreateCategory setAddCategoryModal={setAddCategoryModal} />}


    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {paginatedCategories.map((category, index) => (
        <div
          key={index}
          className="p-4 bg-gray-50 rounded-md shadow hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
          <p className="text-sm text-gray-600">{category.description}</p>

          <div className=' grid grid-cols-1 md:grid-cols-2 py-2 gap-4'>
            <button
            onClick={()=> handleDeletingCategory(category._id)}
            className='bg-red-500 rounded-sm py-2'>Delete</button>

            <button 
            onClick={()=> populateCategoryObject(category)}

            className='bg-purple-500 rounded-sm py-2'>Update</button>

            {updateCategoryModal && <AdminUpdateCategory setUpdateCategoryModal={setUpdateCategoryModal} categoryObj={categoryObject} categoriesCollection={categoriesCollection}/>}

          </div>
        </div>
      ))}
    </div>
    {/* Pagination Controls */}
    <div className="mt-4 flex justify-between">
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
        onClick={() => setCategoryPage((prev) => Math.max(prev - 1, 1))}
        disabled={categoryPage === 1}
      >
        Previous
      </button>
      <span className="text-gray-700 text-sm p-2">Page {categoryPage} of {totalCategoryPages}</span>
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
        onClick={() => setCategoryPage((prev) => Math.min(prev + 1, totalCategoryPages))}
        disabled={categoryPage === totalCategoryPages}
      >
        Next
      </button>
    </div>

    </div>
  )
}

export default CategorySection