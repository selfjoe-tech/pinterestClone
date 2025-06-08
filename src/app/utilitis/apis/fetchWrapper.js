import useAuthStore from "./useAuthStore";
import { redirect } from "next/navigation";

export async function apiFetch(url, options = {}) {
  const { accessToken, tokenExpiry, setAccessToken, logout } = useAuthStore.getState();

  const expired = !accessToken || !tokenExpiry || Date.now() >= tokenExpiry * 1000;
  if (expired) {
    // try to refresh
    const refreshRes = await fetch("/api/refresh", {
      method: "POST",
      credentials: "include"
    });
    if (!refreshRes.ok) {
      logout();
      redirect("/login'")
      // throw new Error("Session expired");
      
    }
    const { accessToken: newToken, tokenExpiry: newExp } = await refreshRes.json();
    setAccessToken(newToken, newExp);
  }

  // now make the real request
  const fetchOpts = {
    method: options.method,
    body: options.body,
    // only set headers if the caller explicitly passed them
    ...(options.headers && { headers: options.headers })
  };

  return fetch(url, fetchOpts);
}



// import { redirect } from "next/navigation";
// import useAuthStore from "./useAuthStore";

// const apiFetch = async (url, options) => {
//   const { accessToken, setAccessToken, logout, tokenExpiry } = useAuthStore.getState();
  
//   const isTokenExpired = () => {
//     // If there's no token or no expiry, treat it as expired.
//     if (!accessToken || !tokenExpiry) {
//       return true;
//     }
//     // tokenExpiry is assumed to be a Unix timestamp in seconds.
//     return Date.now() >= tokenExpiry * 1000;
//   };

//   if (isTokenExpired()) {
//     try {
//       const response = await fetch('/api/refresh', {
//         method: 'POST',
//         credentials: 'include', // Send HTTP-only cookies
//       });

//       if (!response.ok) {
//         logout();
//         redirect("/login")
//       }

//       const data = await response.json();
//       setAccessToken(data.accessToken);
      
//     } catch (error) {
//       console.log(error)
//       logout();
//       redirect("/login")
//     }
//   }

//   return fetch(url, {
//     method: options.method,
//     credentials: 'include',
//     headers: {
//       ...options.headers,
//       Authorization: `Bearer ${useAuthStore.getState().accessToken}`
//     },
//     body: options.body,
//   });
// };

// export { apiFetch };