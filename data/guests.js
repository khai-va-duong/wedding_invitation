/**
 * Guest list for personalized invitation links.
 *
 * Each entry becomes reachable at:  https://your-site/for/<slug>
 *
 * Fields:
 *   slug       - URL segment, lowercase, no spaces (use dashes). Required.
 *   title      - honorific: "anh", "chị", "cô", "chú", "bác", "ông", "bà", "em", or "" for none.
 *   name       - the guest's name as it should appear in the greeting.
 *   companion  - optional trailing phrase, e.g. "cùng người thương", "và gia đình".
 *   greeting   - optional: fully overrides the computed greeting text above.
 *   note       - optional: organizer-only reminder (e.g. who the contact person is).
 *                Never shown to the guest; listed on admin.html.
 *
 * The rendered greeting is:  "Kính mời {title} {name} {companion}"
 * (or just `greeting` verbatim, if provided).
 *
 * Example:  /for/chi-lien-cung-nguoi-thuong
 *        -> "Kính mời chị Liên cùng người thương"
 */
window.GUEST_LIST = [
  { slug: "hung", title: "", name: "Hưng", companion: "" },
  { slug: "huy", title: "", name: "Huy", companion: "" },
  { slug: "hoang-anh", title: "", name: "Hoàng Anh", companion: "", note: "đầu mối c2" },
  { slug: "quan", title: "", name: "Quân", companion: "" },
  { slug: "trung", title: "", name: "Trung", companion: "", note: "đầu mối DH" },
  { slug: "le", title: "", name: "Lệ", companion: "" },
  { slug: "huong", title: "", name: "Hưởng", companion: "" },
  { slug: "viet", title: "", name: "Việt", companion: "" },
  { slug: "thanh-linh", title: "", name: "Thành Linh", companion: "" },
  { slug: "hieu-bac-ninh", title: "", name: "Hiếu Bắc Ninh", companion: "" },
  { slug: "phu-le", title: "", name: "Phú Lê", companion: "" },
  { slug: "tien-bip", title: "", name: "Tiến bịp", companion: "" },
  { slug: "cuong-cho", title: "", name: "Cường Chớ", companion: "" },
  { slug: "trong-son", title: "", name: "Trọng Sơn", companion: "" },
  { slug: "tien-dung", title: "", name: "Tiến Dũng", companion: "" },
  { slug: "hiep", title: "", name: "Hiệp", companion: "", note: "đầu mối" },
  { slug: "trung-a1", title: "", name: "Trung A1", companion: "" },
  { slug: "long-pino", title: "", name: "Long Pino", companion: "" },
  { slug: "tuan-thang", title: "", name: "Tuấn Thắng", companion: "" },
  { slug: "duong-anh", title: "", name: "Dương Anh", companion: "", note: "đầu mối" },
  { slug: "huy-2", title: "", name: "Huy", companion: "" },
  { slug: "ken", title: "", name: "Ken", companion: "" },
  { slug: "the-anh", title: "", name: "Thế Anh", companion: "" },
  { slug: "thuan", title: "", name: "Thuần", companion: "" },
  { slug: "bac-duy", title: "bác", name: "Duy", companion: "" },
  { slug: "bac-hai-anh", title: "bác", name: "Hải Anh", companion: "" },
  { slug: "bac-viet-anh", title: "bác", name: "Việt Anh", companion: "" },
  { slug: "anh-linh-thong", title: "anh", name: "Linh Thông", companion: "" },
  { slug: "chu-khang", title: "chú", name: "Khang", companion: "" },
  { slug: "anh-mao", title: "anh", name: "Mão", companion: "" },
  { slug: "anh-khai-khang", title: "anh", name: "Khải Kháng", companion: "" },
  { slug: "chi-phuong", title: "chị", name: "Phương", companion: "" },
  { slug: "anh-bien", title: "anh", name: "Biên", companion: "" },
  { slug: "chi-huyen", title: "chị", name: "Huyền", companion: "", note: "Đầu mối FINT" },
  { slug: "chi-bubu", title: "chị", name: "Bubu", companion: "" },
  { slug: "chi-mai", title: "chị", name: "Mai", companion: "" },
  { slug: "anh-hoa", title: "anh", name: "Hòa", companion: "" },
  { slug: "chi-mai-moi", title: "chị", name: "Mai mới", companion: "" },
  { slug: "chi-ba", title: "chị", name: "BA", companion: "" },
  { slug: "anh-chung", title: "anh", name: "Chung", companion: "" },
  { slug: "anh-hoang", title: "anh", name: "Hoàng", companion: "" },
  { slug: "kien", title: "", name: "Kiên", companion: "" },
  { slug: "chi-thuy", title: "chị", name: "Thúy", companion: "" },
  { slug: "chi-kim-oanh", title: "chị", name: "Kim Oanh", companion: "" },
  { slug: "chi-mai-anh", title: "chị", name: "Mai Anh", companion: "" },
  { slug: "huyen", title: "", name: "Huyền", companion: "" },
  { slug: "phuong-anh", title: "", name: "Phương Anh", companion: "" },
  { slug: "ha-do", title: "", name: "Hà Đô", companion: "" },
  { slug: "anh-vy", title: "anh", name: "Vỹ", companion: "" },
  { slug: "anh-dinh", title: "anh", name: "Định", companion: "" },
  { slug: "anh-nam", title: "anh", name: "Nam", companion: "" },
  { slug: "anh-tien", title: "anh", name: "Tiến", companion: "" },
  { slug: "anh-hung", title: "anh", name: "Hùng", companion: "" },
  { slug: "chi-nien-129", title: "chị", name: "Niên 129", companion: "", note: "Đầu mối 129" },
  { slug: "chi-ha-129", title: "chị", name: "Hà 129", companion: "" },
  { slug: "anh-quang-129", title: "anh", name: "Quang 129", companion: "" },
  { slug: "anh-duy-pva", title: "anh", name: "Duy PVA", companion: "" },
  { slug: "anh-hai-fpt", title: "anh", name: "Hải FPT", companion: "" },
  { slug: "anh-minh-fpt", title: "anh", name: "Minh FPT", companion: "" },
  { slug: "duy-fpt", title: "", name: "Duy FPT", companion: "" },
  { slug: "linh-fpt", title: "", name: "Linh FPT", companion: "" },
  { slug: "lam-fpt", title: "", name: "Lâm FPT", companion: "" },
  { slug: "dai-fpt", title: "", name: "Đại FPT", companion: "", note: "Đầu mối FPT" },
  { slug: "kien-dien", title: "", name: "Kiên điên", companion: "" },
  { slug: "em-vu", title: "em", name: "Vũ", companion: "" },
  { slug: "anh-duc", title: "anh", name: "Đức", companion: "" },
];

window.DEFAULT_GUEST = {
  title: "",
  name: "Quý khách",
  companion: "",
};
