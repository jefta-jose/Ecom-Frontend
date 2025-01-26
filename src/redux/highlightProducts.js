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
} from 'firebase/firestore';

export const highlightProductsApiSlice = createApi({
    reducerPath: 'highlightProductApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['highlightsProducts'],
    endpoints: (builder) => ({
        // Fetch highlight Products
        getHighlightProducts: builder.query({
            async queryFn() {
                try {
                    const highlightProductCollection = collection(db, 'highlightsProducts');
                    const querySnapshot = await getDocs(highlightProductCollection);
                    const highlightsProducts = querySnapshot.docs.map((doc) => ({
                        _id: doc.id,
                        ...doc.data(),
                    }));

                    return { data: highlightsProducts };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ _id }) => ({ type: 'highlightsProducts', id: _id })),
                          { type: 'highlightsProducts', id: 'LIST' },
                      ]
                    : [{ type: 'highlightsProducts', id: 'LIST' }],
        }),

        // Get highlightProduct by id
        getHighlightProductById: builder.query({
            async queryFn(id) {
                try {
                    const highlightProductDoc = doc(db, "highlightsProducts", id);
                    const productSnapshot = await getDoc(highlightProductDoc);

                    if (productSnapshot.exists()) {
                        const singleHighlightProduct = { _id: productSnapshot.id, ...productSnapshot.data() };
                        return { data: singleHighlightProduct };
                    } else {
                        return { error: { message: "highlightProduct not found" } };
                    }
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            providesTags: (result, error, id) =>
                result
                    ? [{ type: "highlightsProducts", id }, { type: "highlightsProducts", id: "LIST" }]
                    : [{ type: "highlightsProducts", id: "LIST" }],
        }),

        // Add highlightProduct
        addHighlightProduct: builder.mutation({
            async queryFn(newHighlightProduct) {
                try {
                    const highlightProductCollection = collection(db, 'highlightsProducts');
                    const docRef = await addDoc(highlightProductCollection, newHighlightProduct);
                    return { data: { _id: docRef.id, ...newHighlightProduct } };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: [{ type: 'highlightsProducts', id: 'LIST' }],
        }),

        // Delete a highlightProduct
        deleteHighlightProduct: builder.mutation({
            async queryFn(highlightProductId) {
                try {
                    const highlightProductDoc = doc(db, 'highlightsProducts', highlightProductId);
                    await deleteDoc(highlightProductDoc);
                    return { data: highlightProductId };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: (highlightProductId) => [
                { type: 'highlightsProducts', id: highlightProductId },
                { type: 'highlightsProducts', id: 'LIST' },
            ],
        }),

        // Update highlightProduct
        updateHighlightProduct: builder.mutation({
            async queryFn({ id, highlightProduct }) {
                try {
                    const highlightProductDoc = doc(db, 'highlightsProducts', id);
                    await updateDoc(highlightProductDoc, highlightProduct);
                    return { data: { _id: id, ...highlightProduct } };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: ({ id }) => [
                { type: 'highlightsProducts', id },
                { type: 'highlightsProducts', id: 'LIST' },
            ],
        }),
    }),
});

// Export hooks
export const {
    useAddHighlightProductMutation,
    useDeleteHighlightProductMutation,
    useGetHighlightProductByIdQuery,
    useGetHighlightProductsQuery,
    useUpdateHighlightProductMutation
} = highlightProductsApiSlice;
