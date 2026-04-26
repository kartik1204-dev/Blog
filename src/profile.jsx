import React, { useEffect, useRef, useState } from "react";
import proImg from "./proImg.svg";
import { useDispatch, useSelector } from "react-redux";
import { updateUserProfile } from "./blog";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const profile = () => {
  const userData = useSelector((state) => state.users.userData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const email = userData?.email || localStorage.getItem("email") || "";
  const [name, setName] = useState(userData?.name || localStorage.getItem("name") || "");
  const [image, setImage] = useState(userData?.image || localStorage.getItem("image") || "");
  const [pronoun, setPronoun] = useState(localStorage.getItem("pronoun") || "he");
  const [bio, setBio] = useState(localStorage.getItem("bio") || "");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setName(userData?.name || localStorage.getItem("name") || "");
    setImage(userData?.image || localStorage.getItem("image") || "");
  }, [userData?.name, userData?.image]);

  useEffect(() => {
    const fetchExistingProfile = async () => {
      if (!email) return;

      try {
        setIsLoadingProfile(true);
        const result = await axios.post("http://localhost:3000/blog", { email });
        const serverUser = result?.data?.data?.[0];

        if (!serverUser) return;

        const existingName = serverUser?.name || "";
        const existingImage = serverUser?.image || "";

        setName(existingName);
        setImage(existingImage);

        dispatch(
          updateUserProfile({
            name: existingName,
            image: existingImage,
          }),
        );

        localStorage.setItem("name", existingName);
        if (existingImage) {
          localStorage.setItem("image", existingImage);
        } else {
          localStorage.removeItem("image");
        }
      } catch (error) {
        console.error("Failed to fetch profile", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchExistingProfile();
  }, [email, dispatch]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      setImage(imageData);
      setAvatarError(false);
      console.log(imageData);
    };
    reader.readAsDataURL(file);
  };

  const call = async () => {
    try {
      if (!email) {
        toast.error("User email not found. Please login again.");
        return;
      }

      setIsSaving(true);

      const result = await axios.put("http://localhost:3000/updateProfile", {
        email,
        name: name.trim(),
        image: image || "",
      });

      const updatedUser = result?.data?.user || { email, name, image };

      dispatch(
        updateUserProfile({
          name: updatedUser.name || "",
          image: updatedUser.image || "",
        }),
      );

      localStorage.setItem("name", updatedUser.name || "");
      if (updatedUser.image) {
        localStorage.setItem("image", updatedUser.image);
      } else {
        localStorage.removeItem("image");
      }

      localStorage.setItem("pronoun", pronoun);
      localStorage.setItem("bio", bio);

      toast.success("Profile updated successfully");
      navigate("/home");
    } catch (error) {
      console.error("Profile update error", error);
      toast.error(error?.response?.data?.error || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "40px 16px",
        backgroundColor: "#09344c",
      }}
    >
      <ToastContainer />
      <div
        style={{
          borderRadius: 20,
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 560,
          boxShadow: "0px 20px 50px rgba(0, 0, 0, 0.35)",
          backgroundColor: "rgba(5, 29, 42, 0.92)",
          border: "1px solid rgba(128, 164, 206, 0.35)",
          backdropFilter: "blur(8px)",
          padding: 28,
          gap: 14,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "rgb(214, 229, 247)", fontFamily: "roboto", margin: 0 }}>
            Profile Information
          </h2>
          {isLoadingProfile ? (
            <p style={{ color: "rgb(146, 184, 222)", margin: 0, fontFamily: "roboto", fontSize: 13 }}>
              Fetching profile...
            </p>
          ) : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {!image ? (
            <div
              style={{
                backgroundColor: "rgb(128, 164, 206)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 72,
                width: 72,
                borderRadius: "50%",
                color: "white",
                fontFamily: "roboto",
                fontSize: "30px",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
              id="gmail"
            >
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
          ) : (
            <img
              style={{
                height: 72,
                width: 72,
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid rgb(128, 164, 206)",
              }}
              src={avatarError ? proImg : image}
              onError={() => setAvatarError(true)}
            />
          )}
          <div style={{ display: "flex", gap: 12, fontFamily: "roboto" }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgb(128, 164, 206)",
                color: "rgb(146, 184, 222)",
                borderRadius: 14,
                padding: "7px 16px",
                cursor: "pointer",
              }}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => setImage("")}
              style={{
                backgroundColor: "transparent",
                border: "1px solid rgb(198, 121, 121)",
                color: "rgb(245, 166, 166)",
                borderRadius: 14,
                padding: "7px 16px",
                cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
          <input
            ref={fileInputRef}
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            onChange={handleImage}
          />
        </div>

        <p style={{ color: "rgb(196, 219, 243)", fontFamily: "roboto", margin: 0 }}>Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          style={{
            color: "rgb(240, 247, 255)",
            fontFamily: "roboto",
            width: "100%",
            backgroundColor: "rgba(128, 164, 206, 0.12)",
            border: "1px solid rgba(128, 164, 206, 0.35)",
            outline: "none",
            height: 38,
            borderRadius: 10,
            paddingLeft: 12,
          }}
          type="text"
          placeholder="Enter your name"
        />

        <p style={{ color: "rgb(196, 219, 243)", fontFamily: "roboto", margin: 0 }}>Pronouns</p>
        <select
          style={{
            color: "rgb(240, 247, 255)",
            fontFamily: "roboto",
            width: "100%",
            backgroundColor: "rgba(128, 164, 206, 0.12)",
            border: "1px solid rgba(128, 164, 206, 0.35)",
            outline: "none",
            height: 38,
            borderRadius: 10,
            paddingLeft: 12,
          }}
          value={pronoun}
          onChange={(e) => setPronoun(e.target.value)}
        >
          <option
            style={{
              color: "black",
              fontFamily: "roboto",
            }}
            value="he"
          >
            He
          </option>
          <option
            style={{
              color: "black",
              fontFamily: "roboto",
            }}
            value="her"
          >
            Her
          </option>
          <option
            style={{
              color: "black",
              fontFamily: "roboto",
            }}
            value="she"
          >
            She
          </option>
          <option
            style={{
              color: "black",
              fontFamily: "roboto",
            }}
            value="them"
          >
            Them
          </option>
          <option
            style={{
              color: "black",
              fontFamily: "roboto",
            }}
            value="they"
          >
            They
          </option>
        </select>

        <p style={{ color: "rgb(196, 219, 243)", fontFamily: "roboto", margin: 0 }}>Short Bio</p>
        <input
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          style={{
            color: "rgb(240, 247, 255)",
            fontFamily: "roboto",
            width: "100%",
            backgroundColor: "rgba(128, 164, 206, 0.12)",
            border: "1px solid rgba(128, 164, 206, 0.35)",
            outline: "none",
            height: 44,
            borderRadius: 10,
            paddingLeft: 12,
          }}
          type="text"
          placeholder="Tell something about yourself"
        />

        <div id="empty" style={{ height: 12 }}></div>
        <div
          style={{
            display: "flex",
            gap: 15,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => navigate("/home")}
            style={{
              backgroundColor: "transparent",
              borderRadius: 18,
              border: "1px solid rgb(128, 164, 206)",
              color: "rgb(128, 164, 206)",
              cursor: "pointer",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              paddingBottom: 5,
              fontFamily: "roboto",
              width: 80,
              height: 35,
            }}
          >
            Cancel
          </button>
          <button
            disabled={isSaving}
            onClick={() => call()}
            style={{
              backgroundColor: "rgb(128, 164, 206)",
              borderRadius: 18,
              border: "1px solid rgb(128, 164, 206)",
              color: "rgb(9, 52, 76)",
              cursor: "pointer",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              paddingBottom: 5,
              fontFamily: "roboto",
              width: 80,
              height: 35,
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default profile;
