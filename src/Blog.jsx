import React, { useEffect, useState } from "react";
import axios from "axios";
import like from "./like.svg";
import comment from "./comment.svg";
import bookmark from "./bookmark.svg";
import { useNavigate } from "react-router-dom";
const Blog = () => {
  const [myBlogs, setMyBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  useEffect(()=>{
    console.log("myblogs",myBlogs)
  },[myBlogs])

  const fetchMyBlogs = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const res = await axios.post("http://localhost:3000/blog", {
        email: email,
      });
      setMyBlogs(res?.data?.data?.[0]?.blogs || []);
      console.log("hlo beer", res?.data?.data?.[0]?.blogs);
    } catch (err) {
      console.error("Error fetching blogs", err);
      setErrorMessage("Failed to fetch blogs. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log("useffect run")
    fetchMyBlogs();
  }, []);

  const handleDeleteBlog = async (index) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this blog?");
    if (!isConfirmed) return;

    try {
      setDeletingIndex(index);
      setStatusMessage("");
      setErrorMessage("");

      await axios.delete(`http://localhost:3000/deleteBlog/${email}/${index}`);

      setMyBlogs((prev) => prev.filter((_, blogIndex) => blogIndex !== index));
      setStatusMessage("Blog deleted successfully.");
    } catch (err) {
      console.error("Error deleting blog", err);
      setErrorMessage("Could not delete blog. Please try again.");
    } finally {
      setDeletingIndex(null);
    }
  };

  const handleEditBlog = (index) => {
    navigate(`/edit/${index}`);
  };

  return (
    <div
      style={{
        backgroundColor: "#09344c",
        height: "100vh",
        padding: "24px 16px 40px",
        overflowY: "auto",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ color: "white", fontFamily: "roboto", textAlign: "center", marginBottom: 8 }}>My Blogs</h1>

      {statusMessage && (
        <p style={{ color: "#57d27f", textAlign: "center", fontFamily: "roboto" }}>{statusMessage}</p>
      )}

      {errorMessage && (
        <p style={{ color: "#ff8d8d", textAlign: "center", fontFamily: "roboto" }}>{errorMessage}</p>
      )}

      {isLoading ? (
        <p style={{ color: "white", textAlign: "center", fontFamily: "roboto" }}>Loading blogs...</p>
      ) : myBlogs.length === 0 ? (
        <p style={{ color: "white", textAlign: "center", fontFamily: "roboto" }}>
          You haven’t written any blogs yet.
        </p>
      ) : (
        myBlogs.map((blog, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#0e4967",
              margin: "18px auto",
              padding: "20px",
              borderRadius: "12px",
              width: "min(960px, 92%)",
              display: "flex",
              gap: 18,
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "stretch",
              color: "white",
              fontFamily: "roboto",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ flex: "1 1 360px", minWidth: 280 }}>
              <h2 style={{ marginBottom: 10, lineHeight: 1.3 }}>{blog.title}</h2>
              <p style={{ fontSize: 16, lineHeight: 1.6, marginTop: 0, marginBottom: 10 }}>{blog.blogData[0]?.text}</p>
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <img src={like} alt="like" style={{ height: 20, width: 20, opacity: 0.7 }} />
                <img src={comment} alt="comment" style={{ height: 20, width: 20, opacity: 0.7 }} />
                <img src={bookmark} alt="bookmark" style={{ height: 20, width: 20, opacity: 0.6 }} />
              </div>
            </div>
            <div style={{ flex: "0 1 280px", display: "flex", flexDirection: "column", alignItems: "stretch", gap: 12 }}>
              <img
                src={blog.blogData[1]?.image || "https://via.placeholder.com/420x220?text=No+Image"}
                alt="blog visual"
                style={{ height: 180, width: "100%", borderRadius: "8px", objectFit: "cover", backgroundColor: "#0a3e57" }}
              />
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <button
                  onClick={() => handleEditBlog(index)}
                  style={{ backgroundColor: "#007bff", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", minWidth: 110, fontWeight: 600, flex: "1 1 110px" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteBlog(index)}
                  disabled={deletingIndex === index}
                  style={{ backgroundColor: "#dc3545", color: "white", border: "none", padding: "10px 20px", borderRadius: "6px", cursor: "pointer", opacity: deletingIndex === index ? 0.7 : 1, minWidth: 110, fontWeight: 600, flex: "1 1 110px" }}
                >
                  {deletingIndex === index ? "Deleting..." : "Delete"}
                </button>
              </div>
              
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Blog;
