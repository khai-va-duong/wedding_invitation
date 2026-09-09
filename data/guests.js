/**
 * Guest list for personalized invitation links.
 *
 * Each entry becomes reachable at:  https://your-site/for/<slug>
 *
 * Fields:
 *   slug       - URL segment, lowercase, no spaces (use dashes). Required.
 *   title      - honorific: "anh", "chị", "cô", "chú", "bác", "ông", "bà", or "" for none.
 *   name       - the guest's name as it should appear in the greeting.
 *   companion  - optional trailing phrase, e.g. "cùng người thương", "và gia đình".
 *   greeting   - optional: fully overrides the computed greeting text above.
 *
 * The rendered greeting is:  "Kính mời {title} {name} {companion}"
 * (or just `greeting` verbatim, if provided).
 *
 * Example:  /for/chi-lien-cung-nguoi-thuong
 *        -> "Kính mời chị Liên cùng người thương"
 */
window.GUEST_LIST = [
  {
    slug: "chi-lien-cung-nguoi-thuong",
    title: "chị",
    name: "Liên",
    companion: "cùng người thương",
  },
  {
    slug: "anh-minh-cung-nguoi-thuong",
    title: "anh",
    name: "Minh",
    companion: "cùng người thương",
  },
  {
    slug: "gia-dinh-co-chu-hoa",
    title: "cô chú",
    name: "Hoa",
    companion: "và gia đình",
  },
  {
    slug: "bac-tuan",
    title: "bác",
    name: "Tuấn",
    companion: "",
  },
];

// Shown when no slug matches (default landing page, e.g. shared publicly).
window.DEFAULT_GUEST = {
  title: "",
  name: "Quý khách",
  companion: "",
};
