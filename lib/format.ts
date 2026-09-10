export const formatCurrency = (val: number | string | undefined) => {
  if (val === undefined || val === null || val === "") return "";
  const number =
    typeof val === "string" ? parseInt(val.replace(/\D/g, ""), 10) : val;
  if (isNaN(number)) return "";
  return new Intl.NumberFormat("vi-VN").format(number);
};

export const formatToDatetimeLocal = (isoString?: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "";

  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
