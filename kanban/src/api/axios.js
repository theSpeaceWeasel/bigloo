import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
    withXSRFToken: true
});


// const getCookie = (cookieName) => {
//     const cookieArray = document.cookie.split(";");
  
//     for (const cookie of cookieArray) {
//         let cookieString = cookie;
  
//         while (cookieString.charAt(0) == " ") {
//             cookieString = cookieString.substring(1, cookieString.length);
//         }
//         if (cookieString.indexOf(cookieName + "=") == 0) {
//             return cookieString.substring(cookieName.length + 1, cookieString.length);
//         }
//     }
// }

