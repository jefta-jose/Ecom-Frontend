import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { db } from '@/lib/firebase';
import {
    collection,
    doc,
    getDocs,
    addDoc,
    deleteDoc,
    updateDoc,
} from 'firebase/firestore';

export const categoryApiSlice = createApi({
    reducerPath: 'categoryApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['categories'],
    endpoints: (builder) => ({
        // Fetch Categories
        getCategories: builder.query({
            async queryFn() {
                try {
                    const categoryCollection = collection(db, 'categories');
                    const querySnapshot = await getDocs(categoryCollection);
                    const categories = querySnapshot.docs.map((doc) => ({
                        _id: doc.id,
                        ...doc.data(),
                    }));

                    return { data: categories };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ _id }) => ({ type: 'categories', id: _id })),
                          { type: 'categories', id: 'LIST' },
                      ]
                    : [{ type: 'categories', id: 'LIST' }],
        }),

        // Add Category
        addCategory: builder.mutation({
            async queryFn(newCategory) {
                try {
                    const categoryCollection = collection(db, 'categories');
                    const docRef = await addDoc(categoryCollection, newCategory);
                    return { data: { _id: docRef.id, ...newCategory } };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: [{ type: 'categories', id: 'LIST' }],
        }),

        // Delete a Category
        deleteCategory: builder.mutation({
            async queryFn(categoryId) {
                try {
                    const categoryDoc = doc(db, 'categories', categoryId);
                    await deleteDoc(categoryDoc);
                    return { data: categoryId };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: (categoryId) => [
                { type: 'categories', id: categoryId },
                { type: 'categories', id: 'LIST' },
            ],
        }),

        // Update Category
        updateCategory: builder.mutation({
            async queryFn({ id, category }) {
                try {
                    const categoryDoc = doc(db, 'categories', id);
                    await updateDoc(categoryDoc, category);
                    return { data: { _id: id, ...category } };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: ({ id }) => [
                { type: 'categories', id },
                { type: 'categories', id: 'LIST' },
            ],
        }),
    }),
});

// Export hooks
export const {
    useGetCategoriesQuery,
    useAddCategoryMutation,
    useDeleteCategoryMutation,
    useUpdateCategoryMutation
} = categoryApiSlice;
