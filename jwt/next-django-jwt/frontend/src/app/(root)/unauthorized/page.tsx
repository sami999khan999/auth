import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-[32rem] h-[32rem]">
        <Image src={"/gun.png"} alt="gun" objectFit="center" layout="fill" />
      </div>
    </div>
  );
};

export default page;
