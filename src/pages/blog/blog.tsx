import style from "./blog.module.css";
import { useState, useEffect } from "react";
import { blogAPI } from "../../services/api";
import { Faq } from "./faq/faq";

interface ContentItem {
  type: "description" | "image" | "subtitle";
  data: string;
}

interface BlogMethod {
  id: string;
  educationTabBtnName: string;
  icon: string;
  title: string;
  content: ContentItem[];
}

interface BlogData {
  methods: BlogMethod[];
}

export const BlogPage = () => {
  const [blogData, setBlogData] = useState<BlogData>({ methods: [] });
  const [activeMethod, setActiveMethod] = useState<BlogMethod | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogAPI.getAll();
        setBlogData(data);
        if (data.methods && data.methods.length > 0) {
          setActiveMethod(data.methods[0]);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <section className={style.blog}>
      <div className="container">
        <div className={style.education}>
          <h2 className={style.educationTitle}>
            Приготовление кофе разными способами
          </h2>
          <div className={style.educationTabWrap}>
            {blogData.methods.map((method) => {
              return (
                <button
                  className={`${style.educationTabBtn} ${
                    method === activeMethod ? style.activeEducationTabBtn : ""
                  }`}
                  key={method.id}
                  onClick={() => {
                    setActiveMethod(method);
                  }}
                >
                  <p className={style.educationName}>
                    {method.educationTabBtnName}
                  </p>
                  <img src={method.icon} alt="" className={style.myIconColor} loading="lazy" />
                </button>
              );
            })}
          </div>

          <div className={style.coffeeMakingWaysWrap}>
            {activeMethod && (
              <>
                <h3 className={style.coffeeMakingWaysTitle}>
                  {activeMethod.title}
                </h3>
                {activeMethod.content.map((contentItem, index) => (
                  <div key={index}>
                    {contentItem.type === "description" && (
                      <p className={style.CoffeeMakingWaysDesc}>
                        {contentItem.data}
                      </p>
                    )}
                    {contentItem.type === "image" && (
                      <img
                        src={contentItem.data}
                        alt=""
                        className={style.CoffeeMakingWaysImage}
                        loading="lazy"
                      />
                    )}
                    {contentItem.type === "subtitle" && (
                      <p className={style.coffeeMakingWaysSubtitle}>
                        {contentItem.data}
                      </p>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <Faq />
    </section>
  );
};

