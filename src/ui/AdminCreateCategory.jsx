import { useState } from 'react';

import Label from './Label';
import { useAddCategoryMutation } from '@/redux/categorySlice';

const AdminCreateCategory = ({setAddCategoryModal}) => {
  const [addCategory] = useAddCategoryMutation();

    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleCreatingCategory = async (e ) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const categoryData  = Object.fromEntries(formData);
    
        try {
          setLoading(true);
          await addCategory(categoryData)
          handleCancel();
        } catch (error) {
          setErrMsg('Error creating product. Please try again.');
        } finally {
          setLoading(false);
        }
      };
    
      const handleCancel = () => {
        setAddCategoryModal(false);
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="bg-gray-950 rounded-lg w-full max-w-5xl mx-4 sm:mx-auto">
      <form onSubmit={handleCreatingCategory} className=" py-10 px-6 sm:px-10 lg:px-16 text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => handleCancel()}
          className="bg-red-500 px-5 py-2 cursor-pointer rounded-md"
        >
          Cancel
        </button>

        <div className="border-b border-b-white/10 pb-5">
          <h2 className="text-lg font-semibold uppercase leading-7">Product Form</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Provide the product details to create a new product category.
          </p>
        </div>

        <div className="border-b border-b-white/10 pb-5">
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">

            <div className="sm:col-span-3">
              <Label title="_base" htmlFor="_base" />
              <input
                type="text"
                name="_base"
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
              />
            </div>

            <div className="sm:col-span-3">
              <Label title="Description" htmlFor="description" />
              <input
                type="text"
                name="description"
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
              />
            </div>

            <div className="sm:col-span-4">
              <Label title="Image" htmlFor="image" />
              <input
                type="text"
                name="image"
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
              />
            </div>

            <div className="sm:col-span-4">
              <Label title="Name" htmlFor="name" />
              <textarea
                name="name"
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
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
          {loading ? 'Loading...' : 'Create Category'}
        </button>
      </form>
    </div>
  </div>
  )
}

export default AdminCreateCategory