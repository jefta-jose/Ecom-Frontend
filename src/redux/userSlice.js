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

export const usersApiSlice = createApi({
    reducerPath: 'usersApi',
    baseQuery: fakeBaseQuery(),
    tagTypes: ['users'],
    endpoints: (builder) => ({
        // Fetch Users
        getUsers: builder.query({
            async queryFn() {
                try {
                    const usersCollection = collection(db, 'users');
                    const querySnapshot = await getDocs(usersCollection);
                    const users = querySnapshot.docs.map((doc) => ({
                        _id: doc.id,
                        ...doc.data(),
                    }));

                    return { data: users };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ _id }) => ({ type: 'users', id: _id })),
                          { type: 'users', id: 'LIST' },
                      ]
                    : [{ type: 'users', id: 'LIST' }],
        }),

        // Get user by id
        getUserById: builder.query({
            async queryFn(id) {
                try {
                    const userDoc = doc(db, "users", id);
                    const userSnapshot = await getDoc(userDoc);

                    if (userSnapshot.exists()) {
                        const singleUser = { _id: userSnapshot.id, ...userSnapshot.data() };
                        return { data: singleUser };
                    } else {
                        return { error: { message: "User not found" } };
                    }
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            providesTags: (result, error, id) =>
                result
                    ? [{ type: "users", id }, { type: "users", id: "LIST" }]
                    : [{ type: "users", id: "LIST" }],
        }),

        // Add user
        addUser: builder.mutation({
            async queryFn(newUser) {
                try {
                    const usersCollection = collection(db, 'users');
                    const docRef = await addDoc(usersCollection, newUser);
                    return { data: { _id: docRef.id, ...newUser } };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: [{ type: 'users', id: 'LIST' }],
        }),

        // Delete a user
        deleteUser: builder.mutation({
            async queryFn(userId) {
                try {
                    const userDoc = doc(db, 'users', userId);
                    await deleteDoc(userDoc);
                    return { data: userId };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: (userId) => [
                { type: 'users', id: userId },
                { type: 'users', id: 'LIST' },
            ],
        }),

        // Update user
        updateUser: builder.mutation({
            async queryFn({ id, user }) {
                try {
                    const userDoc = doc(db, 'users', id);
                    await updateDoc(userDoc, user);
                    return { data: { _id: id, ...user } };
                } catch (error) {
                    return { error: { message: error.message } };
                }
            },
            invalidatesTags: ({ id }) => [
                { type: 'users', id },
                { type: 'users', id: 'LIST' },
            ],
        }),
    }),
});

// Export hooks
export const {
    useGetUsersQuery,
    useGetUserByIdQuery,
    useAddUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
} = usersApiSlice;
