import React, { useEffect, useRef, useState } from "react";
import bell from "./bell.svg";
import page from "./page.svg";
import logo from "./logo.jpeg";
import like from "./like.svg";
import commment from "./comment.svg";
import bookmark from "./bookmark.svg";
import chill from "./chill.jpeg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import neon from "./neon.svg";
import design from "./box.jpg";
import { addBlog } from "./blog";
import Blog from "./blog";
import axios from "axios";
import home from "./home.svg";
import { url } from "./api";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const userData = useSelector((state) => state.users.userData);
  const image = userData?.image || "";
  const data = userData?.name || "";
  const [summary, setSummary] = useState("");
  const [summaryCache, setSummaryCache] = useState({});
  const [loading, setLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [blogAvatarError, setBlogAvatarError] = useState(false);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    console.log("hello", blogs);
  }, [blogs]);

  async function run(text, blogId) {
    if (!text || !blogId) return;

    if (summaryCache[blogId]) {
      setSummary(summaryCache[blogId]);
      return;
    }

    try {
      setLoading(true);
      const result = await axios.post(`${url}/summarize`, {
        text,
      });

      const generatedSummary = result?.data?.summary || "No summary available.";
      setSummary(generatedSummary);
      setSummaryCache((prev) => ({
        ...prev,
        [blogId]: generatedSummary,
      }));
    } catch (error) {
      console.error("Summary API error", error);
      setSummary("Unable to load summary right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchBlog();
    // setBlogs(useSelector((state) => state.blogs.blogs);)f
  }, []);
  console.log(blogs);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const fetchBlog = async () => {
    const result = await axios.post(`${url}/fetchBlog`);
    console.log(result.data.data);
    setBlogs(result.data.data[0]);
  };
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  useEffect(() => {
  const handleOutsideClick = (e) => {
    if (!dropdownRef.current?.contains(e.target)) {
      setVisible(false);
    }
  };

  document.addEventListener("mousedown", handleOutsideClick);

  return () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    document.removeEventListener("mousedown", handleOutsideClick);
  };
}, []);
  return (
    <div style={{ backgroundColor: "#09344c", height: "100vh", zIndex: 4 }}>
      <img
        style={{ position: "absolute", height: "100vh", opacity: 0.1 }}
        src={home}
      />
      <div></div>

      <div
        id="main-nav"
        style={{ width: "100%", zIndex: 5, position: "relative" }}
      >
        <div
          style={{
            paddingTop: 16,
            height: 50,
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ paddingLeft: 50, display: "flex", alignItems: "center" }}
          >
            <h1 style={{ color: "rgb(128, 164, 206)", fontFamily: "roboto" }}>
              Blog's
            </h1>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 25,
            }}
          >
            <div onClick={() => navigate("/Blog")}>
              <p
                style={{
                  fontFamily: "roboto",
                  color: "rgb(128, 164, 206)",
                  cursor: "pointer",
                }}
              >
                MyBlog
              </p>
            </div>
            <div style={{}} id="bell">
              <img style={{ height: 18 }} src={bell} />
            </div>
            <div
              onClick={() => navigate("/addblog")}
              id="write"
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <img
                style={{ height: 16, color: "rgb(128, 164, 206)" }}
                src={page}
              />
              <p
                style={{
                  fontFamily: "roboto",
                  color: "rgb(128, 164, 206)",
                  cursor: "pointer",
                }}
              >
                Write
              </p>
            </div>
            <div
              ref={dropdownRef}
              style={{ position: "relative", display: "flex", alignItems: "center" }}
            >
              {!image ? (
                <div
                  onClick={() => setVisible((prev) => !prev)}
                  style={{
                    backgroundColor: "rgb(128, 164, 206)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 55,
                    width: 55,
                    borderRadius: "50%",
                    color: "white",
                    fontFamily: "roboto",
                    fontSize: "25px",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                  id="gmail"
                >
                  {data ? data.charAt(0).toUpperCase() : "U"}
                </div>
              ) : (
                <img
                  onClick={() => setVisible((prev) => !prev)}
                  style={{
                    height: 50,
                    width: 50,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid rgb(128, 164, 206)",
                    backgroundColor: "rgb(128, 164, 206)",
                    cursor: "pointer",
                  }}
                  src={avatarError ? logo : image}
                  onError={() => setAvatarError(true)}
                />
              )}
              <div
                id="block"
                style={{
                  top: "100%",
                  zIndex: 2,
                  backgroundColor: "white",
                  display: visible ? "flex" : "none",
                  flexDirection: "column",
                  boxShadow: "0px 3px 10px rgba(48, 47, 47, 0.1)",
                  width: 180,
                  position: "absolute",
                  right: 0,
                  backdropFilter: "blur(50px)",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
              <div
                onMouseEnter={() =>
                  setHover([true, false, false, false, false, false])
                }
                onClick={()=>{navigate("/profile")}}
                style={{
                  backgroundColor: hover[0] ? "rgb(228, 228, 228)" : "white",
                  width: "100%",
                  borderBottom: "1px solid rgb(184, 182, 182)",
                  display: "flex",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <p style={{ fontFamily: "roboto" }}>Profile</p>
              </div>
              <div
                onMouseEnter={() =>
                  setHover([false, true, false, false, false, false])
                }
                onMouseLeave={() =>
                  setHover([false, false, false, false, false, false])
                }
                style={{
                  display: "flex",
                  backgroundColor: hover[1] ? "rgb(228, 228, 228)" : "white",
                  justifyContent: "center",
                  width: "100%",
                  borderBottom: "1px solid rgb(184, 182, 182)",
                }}
              >
                <p style={{ fontFamily: "roboto" }}>Library</p>
              </div>
              <div
                onMouseEnter={() =>
                  setHover([false, false, true, false, false, false])
                }
                onMouseLeave={() =>
                  setHover([false, false, false, false, false, false])
                }
                style={{
                  backgroundColor: hover[2] ? "rgb(228, 228, 228)" : "white",
                  width: "100%",
                  borderBottom: "1px solid rgb(184, 182, 182)",
                  display: "flex",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <p style={{ fontFamily: "roboto" }}>Stories</p>
              </div>
              <div
                onMouseEnter={() =>
                  setHover([false, false, false, true, false, false])
                }
                onMouseLeave={() =>
                  setHover([false, false, false, false, false, false])
                }
                style={{
                  backgroundColor: hover[3] ? "rgb(228, 228, 228)" : "white",
                  width: "100%",
                  borderBottom: "1px solid rgb(184, 182, 182)",
                  display: "flex",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <p style={{ fontFamily: "roboto" }}>Stats</p>
              </div>
              <div
                onMouseEnter={() =>
                  setHover([false, false, false, false, true, false])
                }
                onMouseLeave={() =>
                  setHover([false, false, false, false, false, false])
                }
                style={{
                  backgroundColor: hover[4] ? "rgb(228, 228, 228)" : "white",
                  width: "100%",
                  borderBottom: "1px solid rgb(184, 182, 182)",
                  display: "flex",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <p style={{ fontFamily: "roboto" }}>Settings</p>
              </div>
              <div
                onMouseEnter={() =>
                  setHover([false, false, false, false, false, true])
                }
                onMouseLeave={() =>
                  setHover([false, false, false, false, false, false])
                }
                onClick={handleLogout}
                style={{
                  backgroundColor: hover[5] ? "rgb(228, 228, 228)" : "white",
                  cursor: "pointer",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <p style={{ fontFamily: "roboto" }}>Sign out</p>
              </div>
            </div>
            </div>
            {/* <div><button onClick={() => navigate("/signup")} style={{cursor:"pointer",color:"white",backgroundColor:'rgb(128, 164, 206)',padding:10,borderRadius:8,fontFamily:'roboto',border:'none',marginRight:10,fontSize:15}}>Login</button></div> */}
          </div>
        </div>
        {/* <div
          id="block"
          style={{
            top: "10%",
            zIndex: 2,
            backgroundColor: "transparent",
            display: visible ? "flex" : "none",
            flexDirection: "column",
            boxShadow: "0px 3px 10px rgba(48, 47, 47, 0.1)",
            width: "13%",
            borderRadius: 30,
            position: "absolute",
            right: "1%",
            backdropFilter: "blur(50px)",
          }}
        >
          <div
            onMouseEnter={() =>
              setHover([true, false, false, false, false, false])
            }
            style={{
              backgroundColor: hover[0] ? "rgb(228, 228, 228)" : "transparent",
              cursor: "pointer",
              display: "flex",
              justifyContent: "center",
              width: "100%",
              borderBottom: "1px solid rgb(184, 182, 182)",
              color: "white",
            }}
          >
            <p style={{ fontFamily: "roboto" }}>Profile</p>
          </div>
          <div
            onMouseEnter={() =>
              setHover([false, true, false, false, false, false])
            }
            onMouseLeave={() =>
              setHover([false, false, false, false, false, false])
            }
            style={{
              display: "flex",
              backgroundColor: hover[1] ? "rgb(228, 228, 228)" : "white",
              justifyContent: "center",
              width: "100%",
              borderBottom: "1px solid rgb(184, 182, 182)",
            }}
          >
            <p style={{ fontFamily: "roboto" }}>Library</p>
          </div>
          <div
            onMouseEnter={() =>
              setHover([false, false, true, false, false, false])
            }
            onMouseLeave={() =>
              setHover([false, false, false, false, false, false])
            }
            style={{
              backgroundColor: hover[2] ? "rgb(228, 228, 228)" : "white",
              width: "100%",
              borderBottom: "1px solid rgb(184, 182, 182)",
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <p style={{ fontFamily: "roboto" }}>Stories</p>
          </div>
          <div
            onMouseEnter={() =>
              setHover([false, false, false, true, false, false])
            }
            onMouseLeave={() =>
              setHover([false, false, false, false, false, false])
            }
            style={{
              backgroundColor: hover[3] ? "rgb(228, 228, 228)" : "white",
              width: "100%",
              borderBottom: "1px solid rgb(184, 182, 182)",
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <p style={{ fontFamily: "roboto" }}>Stats</p>
          </div>
          <div
            onMouseEnter={() =>
              setHover([false, false, false, false, true, false])
            }
            onMouseLeave={() =>
              setHover([false, false, false, false, false, false])
            }
            style={{
              backgroundColor: hover[4] ? "rgb(228, 228, 228)" : "white",
              width: "100%",
              borderBottom: "1px solid rgb(184, 182, 182)",
              display: "flex",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <p style={{ fontFamily: "roboto" }}>Settings</p>
          </div>
          <div
            onMouseEnter={() =>
              setHover([false, false, false, false, false, true])
            }
            onMouseLeave={() =>
              setHover([false, false, false, false, false, false])
            }
            onClick={handleLogout}
            style={{
              backgroundColor: hover[5] ? "rgb(228, 228, 228)" : "white",
              cursor: "pointer",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <p style={{ fontFamily: "roboto" }}>Sign out</p>
          </div>
        </div> */}
      </div>

      <div
        style={{
          paddingLeft: summary === "" ? 24.5 : 0,
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: summary === "" ? "flex-start" : "space-around",
          paddingTop: 20,
        }}
      >
        <div
          style={{
            overflowY: "scroll",
            scrollbarWidth: "none",
            height: 600,
            display: "flex",
            flexDirection: "column",
            width: "60%",
            gap: 40,
          }}
        >
          {blogs?.blogs?.map((element, index) => {
            return (
              <div
                key={`${element?.title || "blog"}-${index}`}
                onMouseEnter={() => {
                  const blogId = element?._id || `${element?.title || "blog"}-${index}`;

                  if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                  }

                  debounceRef.current = setTimeout(() => {
                    const text = (element?.blogData || [])
                      .filter((item) => item?.text)
                      .map((item) => item.text)
                      .join(" ")
                      .trim();

                    run(text, blogId);
                  }, 700);
                }}
                onMouseLeave={() => {
                  if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                  }
                }}
                onClick={() =>
                  navigate("/show", {
                    state: { blog: element, author: blogs.name },
                  })
                }
                style={{
                  gap: 20,
                  zIndex: 4,
                  position: "relative",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  paddingLeft: 10,
                }}
              >
                <div>
                  <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    {!blogs?.image || blogAvatarError ? (
                      <div
                        style={{
                          backgroundColor: "rgb(128, 164, 206)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: 35,
                          width: 35,
                          borderRadius: "50%",
                          color: "white",
                          fontFamily: "roboto",
                          fontSize: "15px",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                        id="gmail"
                      >
                        {blogs?.name ? blogs.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    ) : (
                      <img
                        src={blogs.image}
                        onError={() => setBlogAvatarError(true)}
                        style={{
                          height: 35,
                          width: 35,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "1px solid rgb(128, 164, 206)",
                        }}
                      />
                    )}
                    <p style={{ color: "white", fontFamily: "roboto" }}>
                      {blogs.name}
                    </p>
                  </div>
                  <h1
                    style={{
                      display: "flow",
                      margin: 0,
                      color: "white",
                      fontFamily: "roboto",
                    }}
                  >
                    {element.title}
                  </h1>
                  <div
                    style={{
                      height: "100px",
                      width: "400px",
                      overflow: "hidden",
                    }}
                  >
                    {element.blogData.map((item, index3) => {
                      return (
                        <p
                          style={{
                            width: "100%",
                            fontSize: 16.5,
                            color: "white",
                            fontFamily: "roboto",
                          }}
                        >
                          {item.text && item.text}
                        </p>
                      );
                    })}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    <img
                      style={{ opacity: 0.7, height: 20, width: 30 }}
                      src={like}
                    />
                    <img
                      style={{ opacity: 0.7, height: 20, width: 20 }}
                      src={commment}
                    />
                    <img
                      style={{
                        opacity: 0.6,
                        height: 20,
                        width: 20,
                        marginLeft: 5,
                      }}
                      src={bookmark}
                    />
                  </div>
                </div>
                <div>
                  {element.blogData?.[1]?.image ? (
                    <img style={{ height: 200 }} src={element.blogData?.[1]?.image} />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: summary !== "" || loading ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(13, 29, 47, 0.5)",
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
            borderRadius: "16px",
            transition: "transform 0.3s ease",
            width: "30%",
            paddingLeft: 30,
          }}
        >
          <p style={{ color: "white", fontFamily: "Segoe UI, sans-serif" }}>
            {loading ? "Loading..." : summary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
