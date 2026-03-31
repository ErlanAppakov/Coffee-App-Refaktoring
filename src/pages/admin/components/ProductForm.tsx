import { Product } from "../../../types";
import style from "../admin.module.css";

interface ProductFormProps {
  formData: any;
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
}

export const ProductForm = ({ formData, setFormData, onSubmit, onCancel, isEditing }: ProductFormProps) => {
  const handleWeightChange = (weight: string, price: number) => {
    setFormData({
      ...formData,
      weights: { ...formData.weights, [weight]: price },
    });
  };

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <h2>{isEditing ? "Редактировать товар" : "Добавить товар"}</h2>
        <form onSubmit={onSubmit} className={style.form}>
          <div className={style.formGroup}>
            <label>Название:</label>
            <input
              type="text"
              value={formData.cardTitle}
              onChange={(e) => setFormData({ ...formData, cardTitle: e.target.value })}
              required
            />
          </div>
          <div className={style.formGroup}>
            <label>Описание:</label>
            <textarea
              value={formData.cardDescription}
              onChange={(e) => setFormData({ ...formData, cardDescription: e.target.value })}
              required
            />
          </div>
          <div className={style.formGroup}>
            <label>Путь к изображению:</label>
            <input
              type="text"
              value={formData.cardImage}
              onChange={(e) => setFormData({ ...formData, cardImage: e.target.value })}
              required
            />
          </div>
          <div className={style.weightsGrid}>
            {Object.keys(formData.weights).map((weight) => (
              <div key={weight} className={style.formGroup}>
                <label>Цена ({weight}г):</label>
                <input
                  type="number"
                  value={formData.weights[weight]}
                  onChange={(e) => handleWeightChange(weight, Number(e.target.value))}
                  required
                />
              </div>
            ))}
          </div>
          <div className={style.formGroup}>
            <label>
              <input
                type="checkbox"
                checked={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.checked })}
              />
              Скидка 10%
            </label>
          </div>
          <div className={style.formActions}>
            <button type="submit" className={style.saveBtn}>
              Сохранить
            </button>
            <button type="button" onClick={onCancel} className={style.cancelBtn}>
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
