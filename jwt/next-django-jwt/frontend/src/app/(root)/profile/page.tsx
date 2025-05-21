"use client";

import useResponse from "@/hooks/useAuth";
import apiClient from "@/lib/apiClient";
import React, { useEffect, useState } from "react";

const page = () => {
  const { data, error, loading, setData, setLoading, setError } = useResponse();

  useEffect(() => {
    const fn = async () => {
      setLoading(true);
      const { data, error, status } = await apiClient<any>("user/profile");
      setData(data);
      setError(error);
      setLoading(false);
    };

    fn();
  }, []);

  return (
    <div>
      <h1>{data && JSON.stringify(data)}</h1>
      <p className="absolute top-2 left-2">{error && JSON.stringify(error)}</p>
      <p className="absolute top-2 right-2">{loading && "Loading..."}</p>
    </div>
  );
};

export default page;

// // export default page;
// import { getBaseUrl } from "@/utils/baseUrl";
// import { cookies } from "next/headers";

// const Page = async () => {
//   const cookieStore = await cookies();
//   const accessToken = cookieStore.get("access_token")?.value;
//   const refreshToken = cookieStore.get("refresh_token")?.value;

//   console.log(typeof accessToken);

//   const cookieHeader = `access_token=${accessToken}; refresh_token=${refreshToken}`;

//   console.log(cookieHeader);

//   const res = await fetch(`${getBaseUrl()}/user/profile`, {
//     headers: {
//       cookie: cookieHeader,
//     },
//   });

//   const data = await res.json();

//   console.log(data);

//   if (!res.ok) {
//     console.log(data);
//     return <div>Error loading profile</div>;
//   }

//   return (
//     <div>
//       <h1>{data.hello}</h1>
//     </div>
//   );
// };

// export default Page;
