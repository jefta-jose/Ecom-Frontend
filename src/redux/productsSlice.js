import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
    getDoc,
    query, 
    where
} from 'firebase/firestore';

export const productsApiSlice = createApi({
    reducerPath: 'productApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['products'],
    endpoints: (builder) => ({
        // Fetch Products
        getProducts: builder.query({
            async queryFn() {
                try {
                    const productCollection = collection(db, 'products');
                    const querySnapshot = await getDocs(productCollection);
                    const products = querySnapshot.docs.map((doc) => ({
                        _id: doc.id,
                        ...doc.data(),
                    }));

                    return { data: products };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ _id }) => ({ type: 'products', id: _id })),
                          { type: 'products', id: 'LIST' },
                      ]
                    : [{ type: 'products', id: 'LIST' }],
        }),

        // Get product by id
        getProductById: builder.query({
            async queryFn(id) {
                try {
                    const productDoc = doc(db, "products", id);
                    const productSnapshot = await getDoc(productDoc);

                    if (productSnapshot.exists()) {
                        const singleProduct = { _id: productSnapshot.id, ...productSnapshot.data() };
                        return { data: singleProduct };
                    } else {
                        return { error: { message: "Product not found" } };
                    }
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            providesTags: (result, error, id) =>
                result
                    ? [{ type: "products", id }, { type: "products", id: "LIST" }]
                    : [{ type: "products", id: "LIST" }],
        }),

        // Get products by base
        getProductsByBase: builder.query({
            async queryFn(baseId) {
                try {
                    const productsRef = collection(db, "products");
                    const productsQuery = query(productsRef, where("_base", "==", baseId));
                    const querySnapshot = await getDocs(productsQuery);

                    if (!querySnapshot.empty) {
                        const products = querySnapshot.docs.map((doc) => ({
                            _id: doc.id,
                            ...doc.data(),
                        }));
                        return { data: products };
                    } else {
                        return { error: { message: "No products found for the specified base." } };
                    }
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            providesTags: (result, error, baseId) =>
                result
                    ? [
                        { type: "products", id: baseId },
                        ...result.map(({ _id }) => ({ type: "products", id: _id })),
                        { type: "products", id: "LIST" },
                    ]
                    : [{ type: "products", id: "LIST" }],
        }),

        // Add Product
        addProduct: builder.mutation({
            async queryFn(newProduct) {
                try {
                    const productCollection = collection(db, 'products');
                    const docRef = await addDoc(productCollection, newProduct);
                    return { data: { _id: docRef.id, ...newProduct } };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: [{ type: 'products', id: 'LIST' }],
        }),

        // Delete a Product
        deleteProduct: builder.mutation({
            async queryFn(productId) {
                try {
                    const productDoc = doc(db, 'products', productId);
                    await deleteDoc(productDoc);
                    return { data: productId };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: (productId) => [
                { type: 'products', id: productId },
                { type: 'products', id: 'LIST' },
            ],
        }),

        // Update Product
        updateProduct: builder.mutation({
            async queryFn({ id, product }) {
                try {
                    const productDoc = doc(db, 'products', id);
                    await updateDoc(productDoc, product);
                    return { data: { _id: id, ...product } };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: ({ id }) => [
                { type: 'products', id },
                { type: 'products', id: 'LIST' },
            ],
        }),
    }),
});

// Export hooks
export const {
    useAddProductMutation,
    useDeleteProductMutation,
    useGetProductsQuery,
    useUpdateProductMutation,
    useGetProductByIdQuery,
    useGetProductsByBaseQuery
} = productsApiSlice;
