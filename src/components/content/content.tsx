import { Routes, Route } from "react-router-dom";
import { HomePage } from "../../pages/home/home";
import { BlogPage } from "../../pages/blog/blog";
import { ContactsPage } from "../../pages/contacts/contacts";
import { Products } from "../../pages/products-page/products";
import { ProductDetail } from "../../pages/ProductsDetail/productDetail";
import { CartPage } from "../../pages/cart/cart";

export const Content = () => {
  return (
    <div className="content">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/catalog/:category" element={<Products />} />
        <Route
          path="/catalog/:category/:productId"
          element={<ProductDetail />}
        />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  );
};

