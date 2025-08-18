import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/loginSystem/LoginForm";
import Register from "./components/loginSystem/Register";
import ForgotPassword from "./components/loginSystem/ForgotPassword";
import ResetPassword from "./components/loginSystem/ResetPassword";
import Home from "./components/home/Home";
import Profile from "./components/home/Profile";
import Orders from "./components/home/Orders";
import Settings from "./components/home/Settings";
import Shop from "./components/home/shop/Shop";
import Wishlist from "./components/home/Wishlist";
import Cart from "./components/home/Cart";
import Main from "./components/home/main/Main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Home />}>
          <Route index element={<Main />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="orders" element={<Orders />} />
          <Route path="shop" element={<Shop />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
