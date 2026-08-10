export const formatCurrency = (val: number | string | undefined) => {
  if (val === undefined || val === null || val === "") return "";
  const number =
    typeof val === "string" ? parseInt(val.replace(/\D/g, ""), 10) : val;
  if (isNaN(number)) return "";
  return new Intl.NumberFormat("vi-VN").format(number);
};
