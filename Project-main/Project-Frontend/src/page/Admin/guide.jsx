import { useEffect, useState } from "react";

const Postguide = () => {
    const [articles, setArticles] = useState([]);
    const [form, setForm] = useState({
        title: "",
        description: "",
        image: "",
        content: "",
    });

    // โหลดบทความ
    const fetchArticles = async () => {
        try {
            const res = await fetch("http://localhost:3000/articles");
            const data = await res.json();
            setArticles(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    // เพิ่มบทความ
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await fetch("http://localhost:3000/articles", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            setForm({ title: "", description: "", image: "" });
            fetchArticles(); // รีโหลด
        } catch (err) {
            console.log(err);
        }
    };

    // ลบบทความ
    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:3000/articles/${id}`, {
                method: "DELETE",
            });

            fetchArticles();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={{ padding: "40px", maxWidth: "900px", margin: "auto" }}>
            <h1 style={{ marginBottom: "20px" }}>📘 เพิ่มบทความ</h1>

            {/* ฟอร์ม */}
            <form
                onSubmit={handleSubmit}
                style={{
                    background: "#fff",
                    padding: "20px",
                    borderRadius: "12px",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                    marginBottom: "30px",
                }}
            >
                <input
                    type="text"
                    placeholder="หัวข้อบทความ"
                    value={form.title}
                    onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                    }
                    style={inputStyle}
                    required
                />

                <textarea
                    placeholder="รายละเอียด"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    style={{ ...inputStyle, height: "100px" }}
                    required
                />
                <textarea
                    placeholder="เนื้อหาบทความเต็ม"
                    value={form.content}
                    onChange={(e) =>
                        setForm({ ...form, content: e.target.value })
                    }
                    style={{ ...inputStyle, height: "150px" }}
                />

                <input
                    type="text"
                    placeholder="URL รูปภาพ"
                    value={form.image}
                    onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                    }
                    style={inputStyle}
                />

                <button style={btnAdd}>เพิ่มบทความ</button>
            </form>

            {/* แสดงบทความ */}
            <h2>📄 รายการบทความ</h2>

            {articles.map((item) => (
                <div key={item.id} style={cardStyle}>
                    <img
                        src={item.image}
                        alt=""
                        style={{
                            width: "150px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                        }}
                        onError={(e) =>
                        (e.target.src =
                            "https://placehold.co/150x100?text=No+Image")
                        }
                    />

                    <div style={{ flex: 1 }}>
                        <h3>{item.title}</h3>
                        <p style={{ color: "#555" }}>{item.description}</p>
                    </div>

                    <button
                        onClick={() => handleDelete(item.id)}
                        style={btnDelete}
                    >
                        ลบ
                    </button>
                </div>
            ))}
        </div>
    );
};

// styles
const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
};

const btnAdd = {
    background: "#0c2a5b",
    color: "#fff",
    padding: "10px 20px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
};

const btnDelete = {
    background: "red",
    color: "#fff",
    padding: "8px 12px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
};

const cardStyle = {
    display: "flex",
    gap: "15px",
    alignItems: "center",
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    marginTop: "10px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
};

export default Postguide;