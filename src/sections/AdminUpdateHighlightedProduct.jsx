import { useGetHighlightProductByIdQuery, useUpdateHighlightProductMutation } from "@/redux/highlightProducts";
import Label from "@/ui/Label"
import { useState } from "react"

const AdminUpdateHighlightedProduct = ({setUpdateHighlightedProduct  , higlightedProductObj}) => {
    const [loading , setLoading] = useState(false);
    const [errorMessage , setErrorMessage] = useState('');

    const closeModal = ()=> {
        setUpdateHighlightedProduct(false)
    }

    const [updateHighlightProduct] = useUpdateHighlightProductMutation();
    const {data:singleHighlightProduct} = useGetHighlightProductByIdQuery(higlightedProductObj._id);

    const handleUpdatingHighlightedProduct = async ()=>{
        e.preventDefault();

        const formData = new FormData(e.target);
        const formEntries  = Object.fromEntries(formData);

        const filteredData = Object.fromEntries(
            Object.entries(formEntries).filter(([_, value]) => value.trim() !== "")
        );

        try {

            //merge existing data with filtered 
            const meregedData = {
                ...singleHighlightProduct,
                ...filteredData,
            };

            const payload = {
              id: higlightedProductObj._id,
              highlightProduct: meregedData
            }

            // update the document in firebase 
            await updateHighlightProduct(payload);

            //close the modal
            setUpdateHighlightedProduct(false);
            setErrorMessage('');
        } catch (error) {
            console.error("Error Updating highlighted product" , error);
            setErrorMessage('Failed To Update highlighted Product, Please try again');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-gray-950 rounded-lg w-full max-w-5xl mx-4 sm:mx-auto">
          <form onSubmit={handleUpdatingHighlightedProduct} className=" py-10 px-6 sm:px-10 lg:px-16 text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => closeModal()}
              className="bg-red-500 px-5 py-2 cursor-pointer rounded-md"
            >
              Cancel
            </button>
    
            <div className="border-b border-b-white/10 pb-5">
              <h2 className="text-lg font-semibold uppercase leading-7">Highlighted Product Form</h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Enter Details To Update Highlighted Product
              </p>
            </div>
    
            <div className="border-b border-b-white/10 pb-5">
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Label title="Base" htmlFor="_base" />
                  <input
                    type="text"
                    name="_base"
                    defaultValue={higlightedProductObj._base}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>
    
                <div className="sm:col-span-3">
                  <Label title="Button Title" htmlFor="buttonTitle" />
                  <input
                    type="text"
                    name="buttonTitle"
                    defaultValue={higlightedProductObj.buttonTitle}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>
    
                <div className="sm:col-span-3">
                  <Label title="Color" htmlFor="color" />
                  <input
                    type="text"
                    name="color"
                    defaultValue={higlightedProductObj.color}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>
    
                <div className="sm:col-span-4">
                  <Label title="Image" htmlFor="image" />
                  <input
                    type="text"
                    name="image"
                    defaultValue={higlightedProductObj.image}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="Name" htmlFor="name" />
                  <input
                    type="text"
                    name="name"
                    defaultValue={higlightedProductObj.name}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="Title" htmlFor="title" />
                  <input
                    type="text"
                    name="title"
                    defaultValue={higlightedProductObj.title}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>
    
              </div>
            </div>
    
            {errorMessage && (
              <p className="bg-white/90 text-red-600 text-center py-1 rounded-md tracking-wide font-semibold">
                {errorMessage}
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

export default AdminUpdateHighlightedProduct