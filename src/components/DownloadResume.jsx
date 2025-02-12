import api from "../utils/api";
import React from "react";
const DownloadResume = ({ resume }) => {
  const handleDownload = async () => {
    const response = await api.post("/pdf/download", resume, { responseType: "blob" });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "resume.pdf");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <button onClick={handleDownload}>Download PDF</button>
  );
};

export default DownloadResume;
