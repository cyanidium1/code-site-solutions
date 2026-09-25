import type { ProposalLanguage } from "@/types/proposal";

/**
 * Інтерфейсні підписи КП. Живуть тут, а не в `messages/*.json`, бо
 * next-intl підключається в локальних layout'ах, а /offer/* має власний
 * root layout без провайдера — сторінка навмисно поза мовними групами
 * сайту (мова береться з документа, а не з URL).
 */
export const PROPOSAL_LABELS: Record<
  ProposalLanguage,
  {
    proposalFor: string;
    contents: string;
    preparedBy: string;
    issuedOn: string;
    validUntil: string;
    details: string;
    more: string;
    close: string;
    yourChoice: string;
    alsoChose: string;
    chosen: string;
    choose: string;
    notIncluded: string;
    confidential: string;
    replyWith: (option: string) => string;
    mailSubject: (title: string, option: string) => string;
  }
> = {
  uk: {
    proposalFor: "Комерційна пропозиція для",
    contents: "Зміст",
    preparedBy: "Підготував",
    issuedOn: "Дата",
    validUntil: "Дійсна до",
    details: "Технічні характеристики",
    more: "Подробиці",
    close: "Згорнути",
    yourChoice: "Ваш вибір",
    alsoChose: "Додатково",
    chosen: "Обрано",
    choose: "Обрати",
    notIncluded: "Не входить",
    confidential:
      "Сторінка закрита від пошукових систем і доступна лише за прямим посиланням.",
    replyWith: (option) => `Ви обрали: ${option}`,
    mailSubject: (title, option) => `${title} — ${option}`,
  },
  ru: {
    proposalFor: "Коммерческое предложение для",
    contents: "Содержание",
    preparedBy: "Подготовил",
    issuedOn: "Дата",
    validUntil: "Действует до",
    details: "Технические характеристики",
    more: "Подробнее",
    close: "Свернуть",
    yourChoice: "Ваш выбор",
    alsoChose: "Дополнительно",
    chosen: "Выбрано",
    choose: "Выбрать",
    notIncluded: "Не входит",
    confidential:
      "Страница закрыта от поисковых систем и доступна только по прямой ссылке.",
    replyWith: (option) => `Вы выбрали: ${option}`,
    mailSubject: (title, option) => `${title} — ${option}`,
  },
  en: {
    proposalFor: "Proposal for",
    contents: "Contents",
    preparedBy: "Prepared by",
    issuedOn: "Date",
    validUntil: "Valid until",
    details: "Technical details",
    more: "More",
    close: "Collapse",
    yourChoice: "Your choice",
    alsoChose: "Add-ons",
    chosen: "Selected",
    choose: "Select",
    notIncluded: "Not included",
    confidential:
      "This page is hidden from search engines and reachable only by direct link.",
    replyWith: (option) => `You selected: ${option}`,
    mailSubject: (title, option) => `${title} — ${option}`,
  },
};

/** `uk` — і коли поле порожнє, і коли в базі лежить невідоме значення. */
export function proposalLanguage(value?: string | null): ProposalLanguage {
  return value === "ru" || value === "en" ? value : "uk";
}

/** `<html lang>` / `lang=` для контейнера сторінки. */
export const PROPOSAL_HTML_LANG: Record<ProposalLanguage, string> = {
  uk: "uk-UA",
  ru: "ru",
  en: "en-GB",
};
