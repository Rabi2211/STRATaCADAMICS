import { useEffect } from "react";

const META_DESCRIPTION = "Shop curated fashion, premium essentials, and independent brands at STRATaCADAMICS.";

export function setSeo(title: string, description = META_DESCRIPTION, pathname?: string) {
  document.title = title;

  const setMeta = (selector: string, attribute: string, value: string) => {
    let element = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement("meta");
      element.setAttribute(attribute === "name" ? "name" : "property", attribute);
      document.head.appendChild(element);
    }
    element.setAttribute("content", value);
  };

  setMeta('meta[name="description"]', "name", description);
  setMeta('meta[property="og:title"]', "property", "title");
  setMeta('meta[property="og:description"]', "property", description);
  setMeta('meta[property="og:type"]', "property", "website");

  const ogTitle = document.querySelector('meta[property="og:title"]');
  ogTitle?.setAttribute("content", title);

  let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = `${window.location.origin}${pathname || window.location.pathname}`;
}

export default function Seo({ title, description, pathname }: { title: string; description?: string; pathname?: string }) {
  useEffect(() => setSeo(title, description, pathname), [title, description, pathname]);
  return null;
}
