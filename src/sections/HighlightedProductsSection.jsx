import AdminCreateHighlightedProduct from '@/ui/AdminCreateHighlightedProduct';
import { useEffect, useState } from 'react'
import AdminUpdateHighlightedProduct from './AdminUpdateHighlightedProduct';
import { useDeleteHighlightProductMutation, useGetHighlightProductsQuery } from '@/redux/highlightProducts';

const HighlightedProductsSection = () => {
    const [allHighlightProducts , setallHighlightProducts] = useState([]);

    const [addhighlightedProductModal , setAddhighlightedProductModal] = useState(false);
    const ITEMS_PER_PAGE = 5; // Define items per page
    const [highlightPage, setHighlightPage] = useState(1);
  
    // Helper function to paginate data
    const paginate = (data, page) => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
      };
  
    const paginatedHighlights = paginate(allHighlightProducts, highlightPage);
    const totalHighlightPages = Math.ceil(allHighlightProducts.length / ITEMS_PER_PAGE);
    const [openUpdateModal , setOpenUpdateModal] = useState(false);

    const {data , isLoading} = useGetHighlightProductsQuery();
    const [deleteHighlightProduct] = useDeleteHighlightProductMutation();
      
    useEffect(()=>{
        const fetchAllHighlightProducts = async () => {
            try {
                setallHighlightProducts(data);
            }
            catch (error) {
            console.error("Error fetching data", error);
            }
        };

        if(!isLoading){
          fetchAllHighlightProducts();
        }
    }, [data, isLoading])

    const handleDeletingHighlightProduct = async (HighlightProductId) => {
      try {
        await deleteHighlightProduct(HighlightProductId); // Delete the document
        console.log("Document deleted successfully");
      } catch (error) {
        console.log("Error deleting document", error);
      }
    };
        
    
  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">

    <div className=" flex items-center gap-x-2">
    <h2 className="md:text-2xl font-bold text-indigo-600 mb-4">{allHighlightProducts.length}</h2>
    <h2 className="md:text-2xl font-semibold text-gray-700 mb-4">Highlighted Products</h2>
    </div>

    <button
      onClick={() => setAddhighlightedProductModal(true)}
          className="px-4 py-2 my-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
        >
          Add Highlighted Product
        </button>
        {addhighlightedProductModal && <AdminCreateHighlightedProduct setAddhighlightedProductModal={setAddhighlightedProductModal} />}


    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {paginatedHighlights.map((product, index) => (
        <div
          key={index}
          className="p-4 bg-gray-50 rounded-md shadow hover:shadow-lg transition"
        >
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <p className="text-sm text-gray-600">{product.description}</p>

          <div className=' grid grid-cols-1 md:grid-cols-2 py-2 gap-4'>
            <button 
            onClick={()=> handleDeletingHighlightProduct(product._id)}
            className='bg-red-500 rounded-sm py-2'>Delete</button>
            <button
              onClick={()=> setOpenUpdateModal(true)}
            className='bg-purple-500 rounded-sm py-2'>Update</button>

            {openUpdateModal && <AdminUpdateHighlightedProduct setUpdateHighlightedProduct={setOpenUpdateModal} higlightedProductObj={product} />}
          </div>
        </div>
      ))}
    </div>
    {/* Pagination Controls */}
    <div className="mt-4 flex justify-between">
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
        onClick={() => setHighlightPage((prev) => Math.max(prev - 1, 1))}
        disabled={highlightPage === 1}
      >
        Previous
      </button>
      <span className="text-gray-700 text-sm p-2">Page {highlightPage} of {totalHighlightPages}</span>
      <button
        className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
        onClick={() => setHighlightPage((prev) => Math.min(prev + 1, totalHighlightPages))}
        disabled={highlightPage === totalHighlightPages}
      >
        Next
      </button>
    </div>
    </div>
  )
}

export default HighlightedProductsSection