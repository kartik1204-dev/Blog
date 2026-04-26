import { createSlice } from "@reduxjs/toolkit"

const getInitialUserData = () => {
    if (typeof window === "undefined") {
        return {
            email: "",
            name: "",
            userName: "",
            password: "",
            phoneNum: "",
            image: null,
        }
    }

    return {
        email: localStorage.getItem("email") || "",
        name: localStorage.getItem("name") || "",
        userName: localStorage.getItem("userName") || "",
        password: "",
        phoneNum: localStorage.getItem("phoneNum") || "",
        image: localStorage.getItem("image") || null,
    }
}

const userSlice = createSlice ({
    name: "user",
    initialState : {
        userData: getInitialUserData(),
    },
    reducers:{
        addUser(state, action){
           if (!action.payload || typeof action.payload !== "object") {
            return
           }

           state.userData={
            ...state.userData,
            ...action.payload,
           }

           if (typeof window !== "undefined") {
            if (state.userData.email) localStorage.setItem("email", state.userData.email)
            if (state.userData.name) localStorage.setItem("name", state.userData.name)
            if (state.userData.userName) localStorage.setItem("userName", state.userData.userName)
            if (state.userData.phoneNum) localStorage.setItem("phoneNum", state.userData.phoneNum)

            if (state.userData.image) {
                localStorage.setItem("image", state.userData.image)
            } else {
                localStorage.removeItem("image")
            }
           }
           
         },
        updateUserProfile(state, action) {
            state.userData = {
                ...state.userData,
                ...action.payload,
            }

            if (typeof window !== "undefined") {
                if (state.userData.name) {
                    localStorage.setItem("name", state.userData.name)
                }

                if (state.userData.image) {
                    localStorage.setItem("image", state.userData.image)
                } else {
                    localStorage.removeItem("image")
                }
            }
        },
        addBlog(state, action){
            state.push(action.payload);
           // console.log(action.payload);
         },
        removeBlog(state,action){ 
           //console.log("hi"+action.payload)
           //state.pop(action.payload)
           state.splice(action.payload,1)
        },
        clearAllUser(state,action){ 
            state.userData = {
                email: "",
                name: "",
                userName: "",
                password: "",
                phoneNum: "",
                image: null,
            }

            if (typeof window !== "undefined") {
                localStorage.removeItem("email")
                localStorage.removeItem("name")
                localStorage.removeItem("userName")
                localStorage.removeItem("phoneNum")
                localStorage.removeItem("image")
            }
        },
    },
});
 console.log( userSlice.actions)
export default userSlice.reducer;
export const  {addUser,updateUserProfile,addBlog,removeBlog,clearAllUser}= userSlice.actions;