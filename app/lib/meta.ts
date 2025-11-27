const APP_NAME = import.meta.env.VITE_APP_NAME || "TaskMan";

export const getMetaTitle = (pageTitle?: string) => {
  if (!pageTitle) {
    return APP_NAME;
  }

  return `${pageTitle} | ${APP_NAME}`;
};

export const getMetaDescription = (fallback?: string) => {
  if (fallback) {
    return fallback;
  }

  return `Welcome to ${APP_NAME}!`;
};

export const createPageMeta = (pageTitle: string, description?: string) => [
  { title: getMetaTitle(pageTitle) },
  { name: "description", content: getMetaDescription(description) },
];

