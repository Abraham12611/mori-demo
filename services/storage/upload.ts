export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("filename", file.name);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Image upload failed");
  }
  const { url } = (await res.json()) as { url: string };
  return url;
};

export const deleteImage = async (fileName: string) => {
  await fetch(`/api/delete-image?fileName=${encodeURIComponent(fileName)}`, {
    method: "DELETE",
  });
};