import React, { useEffect, useState } from "react";
import bell from "./bell.svg";
import dots from "./dots.svg";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import addbooks from "./addbooks.svg";
import add from "./add.svg";
import laptop from "./laptop.png";
import doddle from "./doddle2.svg";
import cross from "./cross.svg";
import { addUser } from "./adduser";
import { useNavigate, useParams } from "react-router-dom";
const addBlog = () => {
  const userData = useSelector((state)=>state.users)
  console.log(userData.userData)

  
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = id !== undefined
  const blogIndex = Number(id)
  const dispatch = useDispatch()
  const [hover, setHover] = useState("");
  const data = localStorage.getItem("email");
  console.log(data);
  const [title, setTitle] = useState("");
  const [blogData, setblogData] = useState([{ text: "" }]);
  const [isFetchingBlog, setIsFetchingBlog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  useEffect(() => {
    console.log("ajay beta", blogData);
  }, [blogData]);

  useEffect(() => {
    const fetchBlogById = async () => {
      if (!isEditMode || Number.isNaN(blogIndex)) return;

      try {
        setIsFetchingBlog(true);
        setErrorMessage("");

        const res = await axios.post("http://localhost:3000/blog", {
          email: data,
        });

        const blogs = res?.data?.data?.[0]?.blogs || [];
        const selectedBlog = blogs[blogIndex];

        if (!selectedBlog) {
          setErrorMessage("Blog not found.");
          return;
        }

        setTitle(selectedBlog?.title || "");
        setblogData(
          Array.isArray(selectedBlog?.blogData) && selectedBlog.blogData.length
            ? selectedBlog.blogData
            : [{ text: "" }]
        );
      } catch (error) {
        console.error("Error fetching blog by id", error);
        setErrorMessage("Could not load blog details.");
      } finally {
        setIsFetchingBlog(false);
      }
    };

    fetchBlogById();
  }, [isEditMode, blogIndex, data]);

  const handleOnChange = function (e) {
    const image = (e.target.files[0]);
    const reader= new FileReader()
    reader.onloadend=()=>{
      const base64 = reader.result
      console.log(base64)
      setblogData((prev) => [
        ...prev,
        {
          image: base64,
        },
      ]);
      setblogData((prev) => [
        ...prev,
        {
          text: "",
        },
      ]);
    }
    reader.readAsDataURL(image)

    
  };

  const handlePublish = async function () {
    try {
      setIsSubmitting(true);
      setStatusMessage("");
      setErrorMessage("");

      if (isEditMode) {
        const contentItem = blogData.find((item) => Object.prototype.hasOwnProperty.call(item, "text"));
        const imageItem = blogData.find((item) => Object.prototype.hasOwnProperty.call(item, "image"));

        await axios.put(`http://localhost:3000/updateBlog/${data}/${blogIndex}`, {
          title,
          content: contentItem?.text || "",
          image: imageItem?.image || "",
        });

        setStatusMessage("Blog updated successfully.");
        toast.success("Blog updated successfully");
        navigate("/blog");
        return;
      }

      dispatch(addUser({
        title : title,
        blogData : blogData,
        name : userData.userData.name
      }))

      const result = await axios.post("http://localhost:3000/createBlog", {
        email: data,
        blogData : {
          blogData : blogData,
          title : title,
        },
      });
      if (result.data === "success") {
        setStatusMessage("Blog created successfully.");
        toast.success("Blog created successfully");
        navigate("/home")
      }
    } catch (error) {
      console.error("Error publishing blog", error);
      setErrorMessage(isEditMode ? "Could not update blog." : "Could not create blog.");
      toast.error(isEditMode ? "Could not update blog" : "Could not create blog");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div
      style={{
        overflowY:"scroll",
        
        backgroundColor: "rgb(9, 52, 76)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
   
      <ToastContainer />
      {statusMessage && (
        <p style={{ color: "#6dff97", fontFamily: "roboto", marginTop: 10 }}>{statusMessage}</p>
      )}
      {errorMessage && (
        <p style={{ color: "#ff9f9f", fontFamily: "roboto", marginTop: 10 }}>{errorMessage}</p>
      )}

      <div
        id="blog-div"
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          boxShadow: "0 0 60px rgba(0, 0, 0, 0.2)",
          backgroundColor: "transparent",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ paddingLeft: 50, display: "flex", alignItems: "center" }}>
          <h1 style={{ fontFamily: "roboto", color: "rgb(128, 164, 206)" }}>
            Blog's
          </h1>
        </div>
        <div style={{ display: "flex", gap: 15, marginRight: 20 }}>
          <div
            style={{ display: "flex", alignItems: "center", gap: 25 }}
            id="bell"
          >
            <button
              onMouseLeave={() => setHover(false)}
              onMouseEnter={() => setHover(true)}
              onClick={handlePublish}
              disabled={isSubmitting || isFetchingBlog}
              style={{
                backgroundColor: hover
                  ? "rgb(128, 164, 206)"
                  : "rgb(9, 52, 76)",
                borderRadius: 15,
                border: "1px solid rgb(128, 164, 206)",
                color: hover ? "white" : "rgb(128, 164, 206)",
                cursor: "pointer",
                opacity: isSubmitting || isFetchingBlog ? 0.7 : 1,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 5,
                paddingBottom: 5,
                fontFamily: "roboto",
              }}
            >
              {isFetchingBlog ? "Loading..." : isSubmitting ? (isEditMode ? "Updating..." : "Publishing...") : isEditMode ? "Update" : "Publish"}
            </button>
            <img style={{ height: 20, width: 20 }} src={dots} />
            <img style={{ height: 18 }} src={bell} />
          </div>
          {/* <div
            onClick={() => setVisible(!visible)}
            style={{
              backgroundColor: "rgb(128, 164, 206)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 40,
              width: 40,
              borderRadius: 50,
              color: "white",
              fontFamily: "roboto",
            }}
            id="gmail"
          >
            S
          </div> */}
          <div
            onClick={() => setVisible(!visible)}
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
              fontSize: "18px",
              fontWeight: "bold",
              textTransform: "uppercase",
              marginLeft: 10,
            }}
            id="gmail"
          >
            {data ? data.charAt(0).toUpperCase() : "?"}
          </div>
        </div>
      </div>

      <div
        style={{
          width: "80%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            backgroundColor: "transparent",
            height: "60vh",
            display: "flex",
            flexDirection: "column",
            paddingTop: 50,
            zIndex: 1,
          }}
        >
          <h1
            style={{
              fontSize: 25,
              fontFamily: "roboto",
              color: "rgb(128, 164, 206)",
            }}
          >
            Add Images
          </h1>
          <img style={{ height: 40, cursor: "pointer" }} src={add} />
          <input
            onChange={handleOnChange}
            style={{
              position: "absolute",
              top: "20%",
              left: "10%",
              fontSize: 30,
              opacity: 0,
            }}
            type="file"
          />
        </div>
        <img
          style={{
            position: "absolute",
            height: "105vh",
            right: "50%",
            opacity: 0.1,
            top: "9%",
          }}
          src={doddle}
        />
        <img
          style={{
            position: "absolute",
            height: "105vh",
            left: "40%",
            opacity: 0.1,
            top: "9%",
          }}
          src={doddle}
        />
        <img
          style={{
            position: "absolute",
            height: "105vh",
            left: "80%",
            opacity: 0.1,
            top: "9%",
          }}
          src={doddle}
        />

        <div>
          <div style={{zIndex:1,position:"relative"}}>
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              disabled={isFetchingBlog}
              style={{
                fontFamily: "roboto",
                color: "rgb(128, 164, 206)",
                backgroundColor: "transparent",
                fontSize: 35,
                border: "none",
                outline: "none",
                marginBottom: 20,
                marginTop: 50,
                
              }}
              type="text"
              placeholder="Title"
            />
          </div>
          <div
            style={{
              padding: 10,
              boxShadow: "0 0 60px rgba(0, 0, 0, 0.2)",
              backgroundColor: "transparent",
              height: "70vh",
              width: "60vw",
              borderRadius: 10,
              zIndex: 2,
              position: "relative",
              backdropFilter: "blur(10px)",
              overflow: "hidden",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <style>
              {`
          .custom-input::placeholder {
            color:white;
          }
        `}
                    
            </style>
            {blogData.map((item, index) => {
              return (
                <div key={index} style={{ width: "100%" }}>
                  {(item?.text || item?.text === "") && (
                    <textarea
                      disabled={isFetchingBlog}
                      rows={4}
                      cols={50}
                      style={{
                        color: "white",
                        backgroundColor: "transparent",
                        border: "none",
                        outline: "none",
                        width: "100%",
                      }}
                      type="text"
                      value={item.text}
                      placeholder="type here..."
                      onChange={(e) => {
                        console.log(e.target.value);
                        setblogData((prev) => {
                          const updatedArray = [...prev];

                          updatedArray[index] = { text: e.target.value };
                          console.log(updatedArray, "ks");
                          return updatedArray;
                        });
                      }}
                    />
                  )}
                  {item?.image && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                       <div
                        onClick={() => setblogData((prev) => {
                          return prev.map((item,index2)=>{
                            if(index!=index2)
                              return item

                          })
                        })}
                        style={{
                          right: "30%",
                          position: "absolute",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 22,
                          width: 22,
                          borderRadius: 30,
                          backgroundColor: "rgb(145, 145, 145,0.6)",
                        }}
                      >
                        <img style={{ height: 12 }} src={cross} />
                      </div>
                      <img style={{ height: 200 }} src={item.image} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default addBlog;
