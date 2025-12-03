import React, { useState } from "react";
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
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { useEffect } from "react";
const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const image = useSelector((state) => state.users.image);
  const data = useSelector((state) => state.users.name);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    console.log("hello", blogs);
  }, [blogs]);

  /*
   * Install the Generative AI SDK
   *
   * $ npm install @google/generative-ai
   */

  const genAI = new GoogleGenerativeAI(
    "AIzaSyBXLyOTVyAYEjuO9MrzB8mIVg1TiP18NM4"
  );

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run(prompt) {
    console.log(prompt);
    const chatSession = model.startChat({
      generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [],
    });

    const result = await chatSession.sendMessage(
      "Write It Summary... " + prompt
    );
    console.log(result.response.text());
    setSummary(result.response.text());
    return result.response.text();
  }
  useEffect(() => {
    fetchBlog();
    // setBlogs(useSelector((state) => state.blogs.blogs);)f
  }, []);
  console.log(blogs);
  const navigate = useNavigate();
  const fetchBlog = async () => {
    const result = await axios.post("http://localhost:3000/fetchBlog");
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
  return (
    <div style={{ backgroundColor: "#09344c", height:"100vh", zIndex: 4 }}>
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
            {image == null ? (
              <div
                onClick={() => setVisible(true)}
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
                }}
                id="gmail"
              >
                {data ? data.charAt(0).toUpperCase() : "?"}
              </div>
            ) : (
              <img
                style={{ height: 50, width: 50, borderRadius: "50%" }}
                src={image}
              />
            )}
            <div
              id="block"
              style={{
                top: "30%",
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
                  backgroundColor: hover[0]
                    ? "rgb(228, 228, 228)"
                    : "transparent",
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
            {/* <div><button onClick={() => navigate("/signup")} style={{cursor:"pointer",color:"white",backgroundColor:'rgb(128, 164, 206)',padding:10,borderRadius:8,fontFamily:'roboto',border:'none',marginRight:10,fontSize:15}}>Login</button></div> */}
          </div>
        </div>
        <div
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
        <div style={{overflowY:"scroll" ,scrollbarWidth:"none", height: 600,display:"flex", flexDirection:"column", width: "60%" , gap : 40}}>
          {blogs?.blogs?.map((element, index) => {
            return (
              <div
                onMouseEnter={() => {
                  console.log(element);
                  const temp = element.blogData.map((element, index2) => {
                    if (element.text) return element;
                    else return "";
                  });
                  console.log(temp);
                  run(temp.map((item) => item.text).join(" "));
                }}
                onClick={()=>navigate("/show",{state:{blog : element,author : blogs.name}})}
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
                    <div
                      onClick={() => setVisible(true)}
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
                      {blogs.image ? "" : blogs?.name?.charAt(0)?.toUpperCase()}
                    </div>
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
                  <div style={{height:'100px', width:"400px",overflow:"hidden"}}>
                     {
                  element.blogData.map((item,index3)=>{
                    return(  
                       <p
                    style={{
                      width: "100%",
                      fontSize: 16.5,
                      color: "white",
                      fontFamily: "roboto",
                    }}
                  >
                    {item.text && item.text}
                  </p>)
                
                  })
                 }
                  </div>
                
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 , marginTop: 10 }}
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
                  <img
                    style={{ height: 200 }}
                    src={element.blogData[1].image}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: summary != "" ? "flex" : "none",
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
            {summary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
