"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function UploadFile() {
  const [file, setFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (
      !file ||
      (file.type !== "image/jpeg" &&
        file.type !== "image/png" &&
        file.type !== "application/pdf")
    ) {
      setUploadMessage("Please upload a JPEG, PNG, or PDF file.");
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUploadMessage("User not logged in.");
      return;
    }

    // TODO: 사업자 등록증을 1장만 유지할 것인지?
    // TODO: 업로드 시 파일명 중요한지?
    const now = Date.now();
    const filePath = `${user.id}/a${now}`;
    const { error } = await supabase.storage
      .from("image") // Replace with your bucket name
      .upload(filePath, file);

    if (error) {
      console.error(error);
      setUploadMessage("File upload failed: " + error.message);
    } else {
      setUploadMessage("File uploaded successfully!");
    }
  };

  return (
    <div>
      <h2>Upload a JPEG File</h2>
      <input
        type="file"
        accept="image/jpeg, image/png, application/pdf"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload}>Upload</button>
      {uploadMessage && <p>{uploadMessage}</p>}
    </div>
  );
}
