import { useUpdateHighlightProductMutation } from "@/redux/highlightProducts";
import { useGetProductByIdQuery, useUpdateProductMutation } from "@/redux/productsSlice";
import Label from "@/ui/Label"
import { useState } from "react"

const AdminUpdateProduct = ({setOpenModal , productObj}) => {
    console.log(productObj , "productObj");
    console.log("reached here");
    
    const [loading , setLoading] = useState(false);
    const [errorMessage , setErrorMessage] = useState('');

    const closeModal = ()=> {
        setOpenModal(false)
    }

    const [updateProduct] = useUpdateProductMutation();
    const {data: singleProduct} = useGetProductByIdQuery(productObj._id)

    const handleUpdatingProduct = async (e)=>{
        e.preventDefault();

        const formData = new FormData(e.target);
        const formEntries  = Object.fromEntries(formData);

        const filteredData = Object.fromEntries(
            Object.entries(formEntries).filter(([_, value]) => value.trim() !== "")
        );

        try {

            //merge existing data with filtered 
            const meregedData = {
                ...singleProduct,
                ...filteredData,
            };

            const payload = {
              id: productObj._id,
              product: meregedData,
            }

            // update the document in firebase 
            await updateProduct(payload);

            //close the modal
            setOpenModal(false);
            setErrorMessage('');
        } catch (error) {
            console.error("Error Updating product" , error);
            setErrorMessage('Failed To Update  Product, Please try again');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-gray-950 rounded-lg w-full max-w-5xl mx-4 sm:mx-auto">
          <form onSubmit={handleUpdatingProduct} className=" py-10 px-6 sm:px-10 lg:px-16 text-white max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => closeModal()}
              className="bg-red-500 px-5 py-2 cursor-pointer rounded-md"
            >
              Cancel
            </button>
    
            <div className="border-b border-b-white/10 pb-5">
              <h2 className="text-lg font-semibold uppercase leading-7"> Product Form</h2>
              <p className="mt-1 text-sm leading-6 text-gray-400">
                Enter Details To Update Product
              </p>
            </div>
    
            <div className="border-b border-b-white/10 pb-5">
              <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <Label title="Base" htmlFor="_base" />
                  <input
                    type="text"
                    name="_base"
                    defaultValue={productObj._base}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>
    
                <div className="sm:col-span-3">
                  <Label title="Brand" htmlFor="brand" />
                  <input
                    type="text"
                    name="brand"
                    defaultValue={productObj.brand}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>
    
                <div className="sm:col-span-3">
                  <Label title="category" htmlFor="category" />
                  <input
                    type="text"
                    name="category"
                    defaultValue={productObj.category}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>
    
                <div className="sm:col-span-4">
                <Label title="Colors (comma separated)" htmlFor="colors" />
                  <input
                    type="text"
                    name="colors"
                    defaultValue={productObj.colors}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="Description" htmlFor="description" />
                  <input
                    type="text"
                    name="description"
                    defaultValue={productObj.description}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="DiscountedPrice" htmlFor="discountedPrice" />
                  <input
                    type="number"
                    name="discountedPrice"
                    defaultValue={productObj.discountedPrice}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                <Label title="Images (comma separated)" htmlFor="images" />
                  <input
                    type="text"
                    name="images"
                    defaultValue={productObj.images}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="Is New" htmlFor="isNew" />
                  <input
                    type="checkbox"
                    name="isNew"
                    defaultValue={productObj.isNew}
                    className="w-5 h-5 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="Is Stock" htmlFor="isStock" />
                  <input
                    type="checkbox"
                    name="isStock"
                    defaultValue={productObj.isStock}
                    className="w-5 h-5 mt-2"
                  />
                </div>
                
                <div className="sm:col-span-4">
                  <Label title="Name" htmlFor="name" />
                  <input
                    type="text"
                    name="name"
                    defaultValue={productObj.name}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="Over View" htmlFor="overView" />
                  <input
                    type="text"
                    name="overView"
                    defaultValue={productObj.overView}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="Quantity" htmlFor="quantity" />
                  <input
                    type="number"
                    name="quantity"
                    defaultValue={productObj.quantity}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="Rating" htmlFor="rating" />
                  <input
                    type="number"
                    name="rating"
                    defaultValue={productObj.rating}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="Regular Price" htmlFor="regularPrice" />
                  <input
                    type="number"
                    name="regularPrice"
                    defaultValue={productObj.regularPrice}
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 px-4 outline-none text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-skyText sm:text-sm sm:leading-6 mt-2"
                  />
                </div>

                <div className="sm:col-span-4">
                  <Label title="Reviews" htmlFor="reviews" />
                  <input
                    type="number"
                    name="reviews"
                    defaultValue={productObj.reviews}
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

export default AdminUpdateProduct