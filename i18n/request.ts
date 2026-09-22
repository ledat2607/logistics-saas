import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !["vi", "en"].includes(locale)) {
    locale = "vi";
  }

  // Khai báo import rõ ràng từng locale để Turbopack không bị lỗi dynamic import
  let messages;
  switch (locale) {
    case "en":
      messages = (await import("../messages/en.json")).default;
      break;
    case "vi":
    default:
      messages = (await import("../messages/vi.json")).default;
      break;
  }

  return {
    locale,
    messages,
  };
});
