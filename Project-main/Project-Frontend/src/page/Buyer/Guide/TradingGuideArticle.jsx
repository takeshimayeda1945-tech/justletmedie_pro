import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const TradingGuideArticle = () => {
    const { id } = useParams();
    const [article, setArticle] = useState(null);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await fetch(`http://localhost:3000/articles/${id}`);
                const data = await res.json();
                setArticle(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchArticle();
        window.scrollTo(0, 0);
    }, [id]);

    if (!article) return <p style={{ textAlign: "center" }}>Loading...</p>;

    return (
        <div style={{ background: "#f6f7fb", minHeight: "100vh" }}>

            {/* 🔙 Back */}
            <div style={{ padding: "20px", background: "#0c2a5b" }}>
                <Link
                    to="/buyer/tradingguide"
                    style={{
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: "bold"
                    }}
                >
                    ← Back
                </Link>
            </div>

            {/* 🔵 Header */}
            <div
                style={{
                    textAlign: "center",
                    background: "#0c2a5b",
                    padding: "40px 20px",
                    color: "white",
                }}
            >
                <h2
                    style={{
                        fontSize: "28px",
                        fontWeight: "bold",
                        maxWidth: "800px",
                        margin: "0 auto 10px",
                        lineHeight: "1.4",
                    }}
                >
                    {article.title}
                </h2>

                <p style={{ fontSize: "14px", opacity: 0.8 }}>
                    {new Date(article.created_at).toLocaleDateString()}
                </p>

                {/* 🖼️ รูป */}
                <img
                    src={article.image || "https://picsum.photos/500/300"}
                    alt={article.title}
                    onError={(e) => {
                        e.target.src = "https://picsum.photos/500/300";
                    }}
                    style={{
                        width: "100%",
                        maxWidth: "500px",
                        borderRadius: "12px",
                        marginTop: "20px",
                        objectFit: "cover",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}
                />
            </div>

            {/* 📄 Content */}
            <div
                style={{
                    maxWidth: "800px",
                    margin: "40px auto",
                    padding: "0 20px",
                }}
            >
                <div
                    style={{
                        background: "#fff",
                        padding: "25px",
                        borderRadius: "12px",
                        lineHeight: "1.9",
                        fontSize: "16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                        whiteSpace: "pre-line",   // 🔥 ตัวสำคัญ
                    }}
                >
                    <p>{article.content}</p>
                </div>
            </div>
        </div>
    );
};

export default TradingGuideArticle;