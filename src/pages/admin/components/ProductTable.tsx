import { Product } from "../../../types";
import style from "../admin.module.css";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string | number) => void;
}

export const ProductTable = ({ products, onEdit, onDelete }: ProductTableProps) => {
  return (
    <div className={style.tableWrapper}>
      <table className={style.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Описание</th>
            <th>Цена (100г)</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.cardTitle}</td>
              <td className={style.descCell}>{product.cardDescription}</td>
              <td>{Object.values(product.weights)[0]} ₽</td>
              <td>
                <div className={style.actions}>
                  <button
                    className={style.editBtn}
                    onClick={() => onEdit(product)}
                  >
                    Редактировать
                  </button>
                  <button
                    className={style.deleteBtn}
                    onClick={() => onDelete(product.id)}
                  >
                    Удалить
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
