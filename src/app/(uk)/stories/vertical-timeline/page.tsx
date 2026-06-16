import {
  VerticalTimeline,
  type TimelineStep,
} from "@/components/blocks/vertical-timeline";

export const metadata = { title: "Story · vertical-timeline" };

const STEPS: TimelineStep[] = [
  {
    n: "01",
    title: "Бриф",
    duration: "1 день · безкоштовно",
    body: "30-хв дзвінок. Розбираємо задачу, цілі, аудиторію, бюджет. На виході — точна вилка ціни.",
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Слухаємо задачу і ставимо уточнюючі питання",
        "Аналізуємо 2-3 ваших конкурентів",
        "Даємо рекомендацію щодо пакета і термінів",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Розповідаєте про бізнес і ціль сайту",
        "Даєте 3-5 сайтів-референсів",
        "Озвучуєте бюджет і дедлайн",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Письмова оцінка (PDF) з вилкою ціни",
        "Рекомендація щодо пакету і scope",
        "Список наступних кроків",
      ],
    },
  },
  {
    n: "02",
    title: "Договір і передоплата",
    duration: "1-3 дні",
    body: "Підписуємо договір — Diia.Sign або PDF. Ви робите 50% передоплати. Фіксована сума, фіксований термін.",
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Складаємо договір з фіксованою сумою",
        "Прописуємо etapи з deliverables",
        "Виставляємо рахунок на 50%",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Перечитуєте договір",
        "Підписуєте через Diia.Sign або PDF",
        "Робите 50% передоплати",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Підписаний договір",
        "Право на 2 раунди правок",
        "Право на неустойку 30%",
      ],
    },
  },
  {
    n: "03",
    title: "Дизайн",
    duration: "1-2 тижні",
    body: "Створюємо макети у Figma. Спершу moodboard, потім головна, далі — внутрішні. 2 повних раунди правок.",
    weDo: {
      heading: "Що робимо ми",
      items: [
        "Збираємо moodboard з референсів",
        "Дизайнимо головну (1-3 версії)",
        "Адаптуємо під mobile і tablet",
      ],
    },
    youDo: {
      heading: "Що робите ви",
      items: [
        "Затверджуєте moodboard",
        "Затверджуєте дизайн головної",
        "Перевіряєте mobile-версії",
      ],
    },
    deliverable: {
      heading: "Deliverable",
      items: [
        "Figma-файл з повним дизайном",
        "Mobile + Tablet + Desktop макети",
        "Передача прав на дизайн",
      ],
    },
  },
];

export default function VerticalTimelineStory() {
  return (
    <VerticalTimeline
      eyebrow="/ STORY"
      heading={
        <>
          7 кроків від <em>брифу</em> до запуску
        </>
      }
      sub="Кожен крок — фіксований дедлайн, чіткий deliverable, відома сума."
      steps={STEPS}
    />
  );
}
