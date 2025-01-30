import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { store } from "../lib/store";
import Container from "../ui/Container";
import FormattedPrice from "../ui/FormattedPrice";
import Loading from "../ui/Loading";

const Orders = () => {
  const { currentUser } = store();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        let allOrders = [];

        // Fetch normal orders from 'orders' collection
        const orderRef = doc(db, "orders", currentUser?.email);
        const orderSnap = await getDoc(orderRef);

        if (orderSnap.exists()) {
          allOrders = [...(orderSnap.data()?.orders || [])]; // Fetch normal orders
        }

        // Fetch Mpesa orders from 'mpesaOrders' collection
        let userPhoneNumber = currentUser?.phoneNumber;

        // Ensure the phone number is in the correct format (starting with 254)
        if (userPhoneNumber.startsWith("0")) {
          userPhoneNumber = "254" + userPhoneNumber.slice(1);
        }

        const mpesaOrderRef = doc(db, "mpesaOrders", userPhoneNumber);
        const mpesaOrderSnap = await getDoc(mpesaOrderRef);
        let allMpesaOrders = [];

        if (mpesaOrderSnap.exists()) {
          // If the document exists, directly access the entire order data
          const orderData = mpesaOrderSnap.data(); // Access the entire document data

          // Assuming the whole document should be added as a new order
          allMpesaOrders = [orderData];
        } else {
          console.log("No Mpesa Orders found for this user.");
        }

        // Merge normal orders and Mpesa orders
        allOrders = [...allOrders, ...allMpesaOrders]; // Add Mpesa orders to the normal orders array

        setOrders(allOrders); // Set all merged orders to the state
      } catch (error) {
        console.log("Data fetching error", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [currentUser?.email, currentUser?.phoneNumber]);

  return (
    <Container>
      {loading ? (
        <Loading />
      ) : orders?.length > 0 ? (
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mt-1">Customer order details</h2>
          <p className="text-gray-600">
            Customer Name{" "}
            <span className="text-black font-semibold">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
          </p>
          <p className="text-gray-600">
            Total Orders{" "}
            <span className="text-black font-semibold">{orders?.length}</span>
          </p>
          <p className="text-sm max-w-[600px] tracking-wide text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum
            porro, nemo quisquam explicabo, mollitia inventore nobis id maiores
            odio incidunt quidem rerum delectus quaerat similique voluptates
            dolores perferendis numquam quae.
          </p>
          <div className="flex flex-col gap-3">
            <div className="space-y-6 divide-y divide-gray-900/10">
              {orders?.map((order, index) => {
                const isMpesaOrder = order?.mpesaReceiptNumber; // Check if it's an Mpesa order
                const totalAmt = isMpesaOrder
                  ? order?.amount || 0 // For Mpesa orders, use the amount field
                  : order?.orderItems?.reduce(
                      (acc, item) =>
                        acc + (item?.discountedPrice * item?.quantity || 0),
                      0
                    ); // For normal orders, calculate the total from orderItems

                return (
                  <Disclosure as="div" key={index} className="pt-6">
                    {({ open }) => (
                      <>
                        <dt>
                          <DisclosureButton className="flex w-full items-center justify-between text-left text-gray-900">
                            <span className="text-base font-semibold leading-7">
                              {isMpesaOrder
                                ? `Mpesa Receipt: ${order?.mpesaReceiptNumber}`
                                : `Tracking number: ${order?.paymentId}`}
                            </span>
                            <span>{open ? <FaMinus /> : <FaPlus />}</span>
                          </DisclosureButton>
                        </dt>
                        <DisclosurePanel as="dd" className="mt-5 pr-12">
                          <div className="flex flex-col gap-2 bg-[#f4f4f480] p-5 border border-gray-200">
                            <p className="text-base font-semibold">
                              {isMpesaOrder
                                ? `Mpesa Transaction: #${order?.mpesaReceiptNumber}`
                                : `Your order #${order?.paymentId.substring(0, 20)}...`} has shipped and will be with you soon.
                            </p>
                            <div className="flex flex-col gap-1">
                              <p className="text-gray-600">
                                Order Amount:{" "}
                                <span className="text-black font-medium">
                                  <FormattedPrice amount={totalAmt} />
                                </span>
                              </p>
                              {isMpesaOrder ? (
                                <p className="text-gray-600">
                                  Transaction Date:{" "}
                                  <span className="text-black font-medium">
                                    {order?.transactionDate}
                                  </span>
                                </p>
                              ) : (
                                <>
                                  <p className="text-gray-600">
                                    Order Item Count:{" "}
                                    <span className="text-black font-medium">
                                      {order?.orderItems?.length}
                                    </span>
                                  </p>
                                  <p className="text-gray-600">
                                    Payment Status:{" "}
                                    <span className="text-black font-medium">
                                      Paid by Stripe
                                    </span>
                                  </p>
                                </>
                              )}
                            </div>

                            {/* Render Order Items only for normal orders */}
                            {!isMpesaOrder &&
                              order?.orderItems?.map((item) => (
                                <div
                                  key={item?._id}
                                  className="flex space-x-6 border-b border-gray-200 py-3"
                                >
                                  <Link
                                    to={`/product/${item?._id}`}
                                    className="h-20 w-20 flex-none sm:h-40 sm:w-40 rounded-lg bg-gray-100 border border-gray-300 hover:border-skyText overflow-hidden"
                                  >
                                    <img
                                      src={item?.images[0]}
                                      alt="productImg"
                                      className="h-full w-full object-cover object-center hover:scale-110 duration-300"
                                    />
                                  </Link>
                                  <div className="flex flex-auto flex-col">
                                    <div>
                                      <Link
                                        to={`/product/${item?._id}`}
                                        className="font-medium text-gray-900"
                                      >
                                        {item?.name}
                                      </Link>
                                      <p className="mt-2 text-sm text-gray-900">
                                        {item?.description}
                                      </p>
                                    </div>
                                    <div className="mt-6 flex flex-1 items-end">
                                      <dl className="flex space-x-4 divide-x divide-gray-200 text-sm sm:space-x-6">
                                        <div className="flex">
                                          <dt className="font-medium text-gray-900">
                                            Quantity
                                          </dt>
                                          <dd className="ml-2 text-gray-700">
                                            {item?.quantity}
                                          </dd>
                                        </div>
                                        <div className="flex pl-4 sm:pl-6">
                                          <dt className="text-black font-bold">
                                            Price
                                          </dt>
                                          <dd className="ml-2 text-gray-700">
                                            <span className="text-black font-bold">
                                              <FormattedPrice
                                                amount={item?.discountedPrice}
                                              />
                                            </span>
                                          </dd>
                                        </div>
                                        <div className="flex pl-4 sm:pl-6">
                                          <dt className="font-medium text-gray-900">
                                            SubTotal
                                          </dt>
                                          <dd className="ml-2 text-gray-700">
                                            <span className="text-black font-bold">
                                              <FormattedPrice
                                                amount={
                                                  item?.discountedPrice *
                                                  item?.quantity
                                                }
                                              />
                                            </span>
                                          </dd>
                                        </div>
                                      </dl>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-2xl font-semibold">No orders yet</p>
          <p>You did not create any purchase from us</p>
          <Link
            to={"/product"}
            className="mt-2 bg-gray-800 text-gray-100 px-6 py-2 rounded-md hover:bg-black hover:text-white duration-200"
          >
            Go to Shopping
          </Link>
        </div>
      )}
    </Container>
  );
};

export default Orders;