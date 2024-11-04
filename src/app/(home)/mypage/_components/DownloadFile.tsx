"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function DownloadFile() {
  const [files, setFiles] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessage("User not logged in.");
        return;
      }

      // List files in the user's folder
      const { data: fileList, error } = await supabase.storage
        .from("image") // Replace with your bucket name
        .list(user.id); // List all files in the user's folder

      if (error) {
        console.error(error);
        setMessage("Failed to retrieve files: " + error.message);
      } else {
        setFiles(fileList?.map((file) => file.name) || []);
      }
    };

    fetchFiles();
  }, []);

  const handleDownload = async (fileName: string) => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage("User not logged in.");
      return;
    }

    const filePath = `${user.id}/${fileName}`;
    const { data, error } = await supabase.storage
      .from("image") // 버킷 이름을 바꿔주세요.
      .download(filePath); // 파일 자체를 Blob으로 다운로드

    if (error) {
      console.error(error);
      setMessage("Failed to download file.");
    } else if (data) {
      // Blob을 사용하여 파일을 직접 다운로드
      const blobUrl = URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = fileName; // 다운로드 파일명 지정
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl); // Blob URL 해제
    }
  };

  return (
    <div className="border border-black mx-auto w-[24rem]">
      <h2>Download Files</h2>
      {message && <p>{message}</p>}
      <ul>
        {files.map((fileName) => (
          <li key={fileName} className="my-2">
            <span>{fileName}</span>
            <button
              className="bg-blue-300 p-2 ml-2 rounded-md"
              onClick={() => handleDownload(fileName)}
            >
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
