"use client";
import { useState } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

interface UseUploadImageReturn {
  uploadImage: (file: File, path?: string) => Promise<string>;
  progress: number;
  uploading: boolean;
  error: string | null;
}

export const useUploadImage = (): UseUploadImageReturn => {
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = (
    file: File,
    path: string = "vehicles",
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      setUploading(true);
      setError(null);
      setProgress(0);

      const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
      const storageRef = ref(storage, `${path}/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const currentProgress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          setProgress(currentProgress);
        },
        (err) => {
          console.error("Lỗi upload ảnh Firebase:", err);
          setError(err.message);
          setUploading(false);
          reject(err);
        },
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setUploading(false);
            resolve(url);
          } catch (err: any) {
            setError("Không thể lấy URL hình ảnh");
            setUploading(false);
            reject(err);
          }
        },
      );
    });
  };

  return { uploadImage, progress, uploading, error };
};

export const deleteImageFromFirebase = async (imageUrl: string) => {
  if (!imageUrl || !imageUrl.includes("firebasestorage.googleapis.com")) {
    return; 
  }

  try {
  
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
    console.log("Đã xóa ảnh cũ trên Firebase Storage thành công");
  } catch (error) {
    console.error("Lỗi khi xóa ảnh cũ trên Firebase:", error);
   
  }
};
