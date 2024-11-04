import DownloadFile from "./_components/DownloadFile";
import UploadFile from "./_components/UploadFile";

export default function Mypage() {
  // TODO: 스토리지에 엑셀 업로드
  return (
    <>
      <h1>MyPage</h1>
      <UploadFile />
      <DownloadFile />
    </>
  );
}
