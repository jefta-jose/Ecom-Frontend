import Label from '@/ui/Label';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useState } from 'react';


const AdminUpdateCategory = ({setUpdateCategoryModal , categoryObj , categoriesCollection }) => {

    const [loading, setLoading] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const handleCancel = ()=> {
        setUpdateCategoryModal(false)
      }

    const handleUpdatingCategory = async (e) => {
      e.preventDefault();
    
      const formData = new FormData(e.target);
      const categoryData = Object.fromEntries(formData);
    
      // Filter out empty fields
      const filteredData = Object.fromEntries(
        Object.entries(categoryData).filter(([_, value]) => value.trim() !== "")
      );
    
      try {
        const categoryDocRef = doc(categoriesCollection, categoryObj._id); // Get a reference to the document
    
        // Fetch the existing document data
        const existingDoc = await getDoc(categoryDocRef);
        if (!existingDoc.exists()) {
          setErrMsg("Category does not exist.");
          return;
        }
        const existingData = existingDoc.data(); // Get existing data
    
        // Merge the existing data with the new data
        const updatedData = {
          ...existingData, // Retain existing fields
          ...filteredData, // Overwrite with new data (only non-empty)
        };
    
        // Update the document in Firestore
        await updateDoc(categoryDocRef, updatedData);
    
        // Optionally, close the modal or reset form
        setUpdateCategoryModal(false);
        setErrMsg(""); // Clea previous errors
      } catch (error) {
        console.error("Error updating category:", error);
        setErrMsg("Failed to update category. Please try again.");
      }
    };
      
      

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="bg-gray-950 rounded-lg w-full max-w-5xl mx-4 sm:mx-auto">
      <form onSubmit={handleUpdatingCategory} className=" py-10 px-6 sm:px-10 lg:px-16 text-white max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => handleCancel()}
          className="bg-red-500 px-5 py-2 cursor-pointer rounded-md"
        >
          Cancel
        </button>

        <div className="border-b border-b-white/10 pb-5">
          <h2 className="text-lg font-semibold uppercase leading-7">Product Form</h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            Enter Details To Update Category
          </p>
        </div>

        <div className="border-b border-b-white/10 pb-5">
          <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Label title="Base" htmlFor="_base" />
              <input
                type="text"
                name="_base"
                defaultValue={categoryObj._base}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
              />
            </div>

            <div className="sm:col-span-3">
              <Label title="Description" htmlFor="description" />
              <input
                type="text"
                name="description"
                defaultValue={categoryObj.description}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
              />
            </div>

            <div className="sm:col-span-3">
              <Label title="Image" htmlFor="image" />
              <input
                type="text"
                name="image"
                defaultValue={categoryObj.image}
                className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
              />
            </div>

            <div className="sm:col-span-4">
              <Label title="Name" htmlFor="name" />
              <input
                type="text"
                name="name"
                defaultValue={categoryObj.name}
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
          {loading ? 'Loading...' : 'Update Category'}
        </button>
      </form>
    </div>
  </div>
  )
}

export default AdminUpdateCategory