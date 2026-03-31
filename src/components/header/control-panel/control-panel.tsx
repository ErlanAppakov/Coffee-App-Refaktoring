import style from "../header.module.css";
import SearcIcon from "../../../images/search.svg";
import BasketIcon from "../../../images/basket.svg";
import DefaultUserIcon from "../../../images/default-user-profile.svg";
import { openModal } from "../../../store/slices/modalSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { useState, useRef, useEffect } from "react";
import { productsAPI } from "../../../services/api";
import { openSearch, closeSearch } from "../../../store/slices/searchSlice";
import { useDebounce } from "../../../hooks/useDebounce";
import { useClickOutside } from "../../../hooks/useClickOutside";

interface SearchProduct {
  id: string | number;
  cardTitle: string;
  cardDescription: string;
  cardImage: string;
  weights: Record<string, number>;
  discount?: boolean;
  category: string;
  categoryName: string;
}

export const ControlPanel = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuth, user } = useAppSelector((state) => state.user);
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useClickOutside(searchRef, () => {
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    dispatch(closeSearch());
  });

  useEffect(() => {
    const searchProducts = async () => {
      if (!debouncedSearchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await productsAPI.getAll();
        const results: SearchProduct[] = [];

        Object.keys(data).forEach((categoryKey) => {
          const category = data[categoryKey];
          if (category.products) {
            Object.keys(category.products).forEach((subcategoryKey) => {
              const products = category.products[subcategoryKey];
              if (Array.isArray(products)) {
                products.forEach((product: any) => {
                  const title = product.cardTitle?.toLowerCase() || "";
                  const description = product.cardDescription?.toLowerCase() || "";
                  const query = debouncedSearchQuery.toLowerCase();

                  if (title.includes(query) || description.includes(query)) {
                    results.push({
                      id: product.id,
                      cardTitle: product.cardTitle,
                      cardDescription: product.cardDescription,
                      cardImage: product.cardImage,
                      weights: product.weights,
                      discount: product.discount,
                      category: categoryKey,
                      categoryName: subcategoryKey,
                    });
                  }
                });
              }
            });
          }
        });

        setSearchResults(results);
      } catch (error) {
        console.error("Ошибка поиска:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchProducts();
  }, [debouncedSearchQuery]);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    dispatch(openSearch());
  };

  const handleProductClick = (product: SearchProduct) => {
    navigate(`/catalog/${product.category}/${product.id}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    dispatch(closeSearch());
  };

  const handleUserClick = () => {
    if (isAuth) {
      // Если пользователь авторизован, ведем в личный кабинет
      navigate("/account");
    } else {
      // Если не авторизован, открываем модалку
      dispatch(openModal("register"));
    }
  };

  return (
    <div className={style.controlPanel}>
      {isSearchOpen ? (
        <div ref={searchRef} className={style.searchContainer}>
          <div className={style.searchInputWrapper}>
            <img src={SearcIcon} alt="Search" className={style.searchIcon} />
            <input
              ref={inputRef}
              type="text"
              className={style.searchInput}
              placeholder="Поиск по товарам"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchResults.length > 0 && (
            <div className={style.searchResults}>
              {searchResults.slice(0, 5).map((product) => (
                <div
                  key={`${product.category}-${product.id}`}
                  className={style.searchResultItem}
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={product.cardImage.startsWith("/") ? product.cardImage : `/${product.cardImage}`}
                    alt={product.cardTitle}
                    className={style.searchResultImage}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/src/images/discount-1.png";
                    }}
                  />
                  <div className={style.searchResultInfo}>
                    <h4 className={style.searchResultTitle}>{product.cardTitle}</h4>
                    <p className={style.searchResultDescription}>{product.cardDescription}</p>
                    <p className={style.searchResultPrice}>
                      {Object.values(product.weights)[0]} ₽
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {isLoading && <div className={style.searchLoading}>Поиск...</div>}
          {!isLoading && searchQuery && searchResults.length === 0 && (
            <div className={style.searchNoResults}>Ничего не найдено</div>
          )}
        </div>
      ) : (
        <button className={style.btnControlPanel} onClick={handleSearchClick}>
          <img src={SearcIcon} alt="Search" />
        </button>
      )}
      <button className={style.btnControlPanel}>
        <Link to={'/cart'} className={style.cartLink}>
          <img src={BasketIcon} alt="" />
          {cartItemsCount > 0 && (
            <span className={style.cartBadge}>{cartItemsCount}</span>
          )}
        </Link>
      </button>
      <button
        className={`${style.btnControlPanel} ${isAuth && user?.avatar ? style.btnAvatar : ''}`}
        onClick={handleUserClick}
      >
        {isAuth && user?.avatar ? (
          <img 
            src={user.avatar} 
            alt="User avatar" 
            className={style.userAvatar}
          />
        ) : (
          <img src={DefaultUserIcon} alt="User icon" />
        )}
      </button>
    </div>
  );
};
