import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import SignIn from "../components/SignIn";

import { useAuth } from "../hooks/useAuth";
import { usePayments } from "../hooks/usePayments";
import { axiosClient } from "../lib/axiosClient.ts";

const config = { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } };

const Shop = () => {
  const { user, isAuthenticated, showSignIn, signIn, signOut, closeSignIn, requireAuth } = useAuth();

  const { orderProduct } = usePayments({
    isAuthenticated,
    onRequireAuth: requireAuth,
  });

  const onSendTestNotification = () => {
    const notification = {
      title: "Test Notification",
      body: "This is a test notification",
      user_uid: user?.uid,
      subroute: "/shop",
    };
    axiosClient.post("/notifications/send", { notifications: [notification] }, config);
  };

  return (
    <>
      <Header user={user} onSignIn={signIn} onSignOut={signOut} onSendTestNotification={onSendTestNotification} />

      <ProductCard
        name="Apple Pie"
        description="You know what this is. Pie. Apples. Apple pie."
        price={0.1}
        pictureURL="https://upload.wikimedia.org/wikipedia/commons/4/4b/Apple_pie.jpg"
        onClickBuy={() => orderProduct("Order Apple Pie", 0.1, { productId: "apple_pie_1" })}
      />

      <ProductCard
        name="Lemon Meringue Pie"
        description="Order at your own risk."
        price={0.2}
        pictureURL="https://live.staticflickr.com/1156/5134246283_f2686ff8a8_b.jpg"
        onClickBuy={() =>
          orderProduct("Order Lemon Meringue Pie", 0.2, {
            productId: "lemon_pie_1",
          })
        }
      />

      {showSignIn && <SignIn onSignIn={signIn} onModalClose={closeSignIn} />}
    </>
  );
};

export default Shop;
