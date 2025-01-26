import AdminCreateProduct from '@/ui/AdminCreateProduct';
import { useEffect, useState } from 'react';
import AdminUpdateProduct from './AdminUpdateProduct';
import { useDeleteProductMutation, useGetProductsQuery } from '@/redux/productsSlice';

const ProductsSection = () => {
  const { data: prodcts, isLoading: isFetchingProducts } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const ITEMS_PER_PAGE = 5; // Define items per page
  const [productPage, setProductPage] = useState(1);

  // Helper function to paginate data
  const paginate = (data, page) => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  };

  const paginatedProducts = paginate(allProducts, productPage);
  const totalProductPages = Math.ceil(allProducts.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true); // Start loading
        setAllProducts(prodcts);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    if (!isFetchingProducts) {
      fetchAllProducts();
    }
  }, [prodcts, isFetchingProducts]);

  const handleDeletingProduct = async (productId) => {
    try {
      await deleteProduct(productId); // Delete the document
      console.log('Document deleted successfully');
    } catch (error) {
      console.log('Error deleting document', error);
    }
  };

  const [openModal, setOpenModal] = useState(false);
  const [productObject, setProductObject] = useState({});

  const openUpdateModal = (product) => {
    setOpenModal(true);
    setProductObject(product);
  };

  return (
    <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center gap-x-2">
        <h2 className="md:text-2xl font-bold text-indigo-600 mb-4">{allProducts.length}</h2>
        <h2 className="md:text-2xl font-semibold text-gray-700 mb-4">Products</h2>
      </div>

      <button
        onClick={() => setAddProductModal(true)}
        className="px-4 py-2 my-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
      >
        Add Product
      </button>
      {addProductModal && <AdminCreateProduct setAddProductModal={setAddProductModal} />}

      {loading || isFetchingProducts ? (
        <div className="text-center py-4">Loading products...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {paginatedProducts.map((product, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-md shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
              <p className="text-sm text-gray-600 line-clamp-3">{product.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 py-2 gap-4">
                <button
                  onClick={() => handleDeletingProduct(product._id)}
                  className="bg-red-500 rounded-sm py-2 disabled:opacity-50"
                  disabled={isDeleting}
                >
                  Delete
                </button>
                <button
                  onClick={() => openUpdateModal(product)}
                  className="bg-purple-500 rounded-sm py-2"
                >
                  Update
                </button>

                {openModal && (
                  <AdminUpdateProduct
                    setOpenModal={setOpenModal}
                    productObj={productObject}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between">
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
          onClick={() => setProductPage((prev) => Math.max(prev - 1, 1))}
          disabled={productPage === 1 || loading}
        >
          Previous
        </button>
        <span className="text-gray-700 text-sm p-2">
          Page {productPage} of {totalProductPages}
        </span>
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded-md disabled:opacity-50"
          onClick={() => setProductPage((prev) => Math.min(prev + 1, totalProductPages))}
          disabled={productPage === totalProductPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductsSection;
