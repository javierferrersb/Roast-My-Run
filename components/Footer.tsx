import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-orange-300 bg-orange-100 py-6 text-center text-sm text-gray-700">
      <p>
        {t("madeWith")} •{" "}
        <a
          href="https://github.com/javierferrersb/Roast-My-Run"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-orange-600 hover:text-orange-800 hover:underline"
        >
          {t("github")}
        </a>
      </p>
    </footer>
  );
}
