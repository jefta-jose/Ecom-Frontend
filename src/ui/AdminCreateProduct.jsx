import { useState } from 'react';
import Label from './Label';
import { useAddProductMutation } from '@/redux/productsSlice';

const AdminCreateProduct = ({ setAddProductModal }) => {
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const [addProduct] = useAddProductMutation();

  const handleCreatingProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const productData = Object.fromEntries(formData);

    // Handle colors as an array
    if (productData.colors) {
      productData.colors = productData.colors.split(',').map((color) => color.trim());
    }

    // Handle images as an array
    if (productData.images) {
      productData.images = productData.images.split(',').map((url) => url.trim());
    }

    try {
      setLoading(true);
      await addProduct( productData);
      handleCancel();
    } catch (error) {
      console.log('Error adding document', error);
      setErrMsg('Error creating product. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    setAddProductModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-gray-950 rounded-lg w-full max-w-5xl mx-4 sm:mx-auto">
        <form onSubmit={handleCreatingProduct} className=" py-10 px-6 sm:px-10 lg:px-16 text-white max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => handleCancel()}
            className="bg-red-500 px-5 py-2 cursor-pointer rounded-md"
          >
            Cancel
          </button>

          <div className="border-b border-b-white/10 pb-5">
            <h2 className="text-lg font-semibold uppercase leading-7">Product Form</h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Provide the product details to create a new product.
            </p>
          </div>

          <div className="border-b border-b-white/10 pb-5">
            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Label title="Product Name" htmlFor="name" />
                <input
                  type="text"
                  name="name"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                />
              </div>

              <div className="sm:col-span-3">
                <Label title="_base" htmlFor="_base" />
                <input
                  type="text"
                  name="_base"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                />
              </div>

              <div className="sm:col-span-3">
                <Label title="Brand" htmlFor="brand" />
                <input
                  type="text"
                  name="brand"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                />
              </div>

              <div className="sm:col-span-4">
                <Label title="Category" htmlFor="category" />
                <input
                  type="text"
                  name="category"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                />
              </div>

              <div className="sm:col-span-4">
                <Label title="Colors (comma separated)" htmlFor="colors" />
                <input
                  type="text"
                  name="colors"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                />
              </div>

              <div className="sm:col-span-4">
                <Label title="Description" htmlFor="description" />
                <textarea
                  name="description"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                />
              </div>

              <div className="sm:col-span-3">
                <Label title="Discounted Price" htmlFor="discountedPrice" />
                <input
                  type="number"
                  name="discountedPrice"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                />
              </div>

              <div className="sm:col-span-3">
                <Label title="Regular Price" htmlFor="regularPrice" />
                <input
                  type="number"
                  name="regularPrice"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                />
              </div>

              <div className="sm:col-span-4">
                <Label title="Images (comma separated URLs)" htmlFor="images" />
                <input
                  type="text"
                  name="images"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                />
              </div>

              <div className="sm:col-span-2">
                <Label title="Is New" htmlFor="isNew" />
                <input
                  type="checkbox"
                  name="isNew"
                  className="w-5 h-5 mt-2"
                />
              </div>

              <div className="sm:col-span-2">
                <Label title="In Stock" htmlFor="isStock" />
                <input
                  type="checkbox"
                  name="isStock"
                  className="w-5 h-5 mt-2"
                />
              </div>

              <div className="sm:col-span-2">
                <Label title="Quantity" htmlFor="quantity" />
                <input
                  type="number"
                  name="quantity"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                />
              </div>

              <div className="sm:col-span-2">
                <Label title="Rating" htmlFor="rating" />
                <input
                  type="number"
                  name="rating"
                  className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  min="1"
                  max="5"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          {errMsg && (
            <p className="bg-white/90 text-red-600 text-center py-1 rounded-md tracking-wide font-semibold">
              {errMsg}
            </p>
          )}

          <button
            disabled={loading}
            type="submit"
            className={`mt-5 w-full py-2 uppercase text-base font-bold tracking-wide text-gray-300 rounded-md hover:text-white hover:bg-indigo-600 duration-200 ${
              loading ? 'bg-gray-500 hover:bg-gray-500' : 'bg-indigo-700'
            }`}
          >
            {loading ? 'Loading...' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProduct;
