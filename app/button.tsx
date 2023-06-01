"use client";

import React from "react";
import * as XLSX from "xlsx";

// function downloadExcelFile(data: any[], filename: string) {
//   const worksheet = XLSX.utils.json_to_sheet(data);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
//   const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

//   const blob = new Blob([excelBuffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });
//   const url = URL.createObjectURL(blob);

//   const link = document.createElement("a");
//   link.href = url;
//   link.download = `${filename}.xlsx`;
//   link.click();

//   URL.revokeObjectURL(url);
// }

function downloadExcelFile(data: any[], filename: string) {
  const flattenedData = flattenNestedData(data);
  const headers = getHeaders(flattenedData);

  const worksheet = XLSX.utils.json_to_sheet(flattenedData, { header: headers });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.xlsx`;
  link.click();

  URL.revokeObjectURL(url);
}

function flattenNestedData(data: any[]): any[] {
  const flattenedData: any[] = [];
  for (const item of data) {
    const flattenedItem: any = { ...item };
    if (Array.isArray(item.members)) {
      for (let i = 0; i < item.members.length; i++) {
        const member = item.members[i];
        for (const key in member) {
          flattenedItem[`Member ${i + 1} - ${key}`] = member[key];
        }
      }
    }
    flattenedData.push(flattenedItem);
  }
  return flattenedData;
}

function getHeaders(data: any[]): string[] {
  const headers: string[] = [];
  for (const item of data) {
    for (const key in item) {
      if (!headers.includes(key)) {
        headers.push(key);
      }
    }
  }
  return headers;
}

function MyButton(props: any) {
  const fetchDataAndDownload = () => {
    fetch(
      process.env.NEXT_PUBLIC_BACKEND_URL + props.ev
    )
      .then((response) => response.json())
      .then((data) => {
        const filename = "data";
        if (props.ev == "ignitia") {
          downloadExcelFile(data["yantraTeams"], "hack");
        } else {
          downloadExcelFile(data[props.ev + "RegisteredUsers"], props.ev);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <button
      type="button"
      className="m-4 focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
      onClick={fetchDataAndDownload}
    >
      {props.name}
    </button>
  );
}

export default MyButton;
