"use client";

import Image from "next/image";
import MyButton from "./button";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState<{[key: string]: string}>();

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "reg")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center p-4">
      <div className="flex p-4 flex-col px-4">
        {data &&
          Object.keys(data).map((elem:string) => {
            if (elem !== "message") {
              return (
                <p key={elem}>
                  {elem} : {elem && data[elem]}
                </p>
              );
            }
          })}
      </div>

      <MyButton name="Nexus Registrations" ev="nexus" />
      <MyButton name="Devops Registrations" ev="devops" />
      <MyButton name="T10 Registrations" ev="t10" />
      <MyButton name="Hack Registrations" ev="ignitia" />
    </main>
  );
}
