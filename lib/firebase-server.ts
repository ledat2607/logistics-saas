export const deleteImageFromFirebaseServer = async (imageUrl: string) => {
  if (!imageUrl || !imageUrl.includes("firebasestorage.googleapis.com")) {
    return;
  }

  try {
    const urlObj = new URL(imageUrl);
    const pathSegments = urlObj.pathname.split("/o/");
    if (pathSegments.length < 2) return;

    const bucketName = urlObj.pathname.split("/b/")[1]?.split("/o/")[0];
    const encodedFilePath = pathSegments[1];

    if (!bucketName || !encodedFilePath) return;

    const deleteEndpoint = `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/${encodedFilePath}`;

    const response = await fetch(deleteEndpoint, {
      method: "DELETE",
    });

    if (response.ok) {
      console.log("--> Đã xóa ảnh trên Firebase Storage thành công (Server)");
    } else {
      console.error(`--> Lỗi xóa ảnh Firebase: Status ${response.status}`);
    }
  } catch (error) {
    console.error("Lỗi khi xóa ảnh trên Firebase từ Server:", error);
  }
};
