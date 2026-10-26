/**
 * Site-wide configuration. Edit this file to customize the invitation
 * for your own wedding — no other file needs to change for basic use.
 */
window.SITE_CONFIG = {
  couple: {
    groom: {
      name: "Quang Khải",
      fullName: "Tô Quang Khải",
      parents: "Ông Tô Xuân Khiêm & Bà Hoàng Thị Hiền",
      father: "Tô Xuân Khiêm",
      mother: "Hoàng Thị Hiền",
      // A photo name from assets/img (e.g. "DSC_7455"), a local path, or a full URL — see "photos" below.
      photo: "DSC_7455",
      quote: "Khoảnh khắc gặp được em, anh đã quyết định sẽ cùng em đi đến hết cuộc đời.",
      order: 1, // shown first
    },
    bride: {
      name: "Thuỳ Dương",
      fullName: "Nguyễn Thuỳ Dương",
      parents: "Ông Nguyễn Văn Bẩy & Bà Lương Thị Hơn",
      father: "Nguyễn Văn Bẩy",
      mother: "Lương Thị Hơn",
      photo: "DSC_7510",
      quote: "Giữa thế gian huyên náo, anh là lý do để em mỉm cười mỗi ngày.",
      order: 2,
    },
    // Used for the big cover title, e.g. "Quang Khải & Thuỳ Dương"
    separator: "&",
    // Small cover-page copy
    badge: "SWEET WEDDING",
    tagline: "Together Forever",
    quote: "Hôn nhân là chuyện cả đời, yêu người vừa ý, cưới người mình thương.",
  },

  wedding: {
    // ISO date used by the countdown timer
    date: "2026-11-15T10:00:00+07:00",
    lunarDate: "Tức ngày 07 tháng 10 năm Bính Ngọ",
    hashtag: "#QuangKhaiVaDuong2026",
    // Ceremony timeline, shown as cards in order
    events: [
      {
        title: "Tiệc Mừng Lễ Thành Hôn",
        description: "Bữa tiệc thân mật mừng lễ thành hôn",
        date: "2026-11-15",
        time: "10:00",
        venue: "Nhà Văn Hoá Làng Quyết Tiến",
        address: "Thôn Báo Hà - Xã Vĩnh Hải - TP. Hải Phòng",
        // Same pin as the location QR on the printed card.
        mapUrl: "https://www.google.com/maps?q=20.650437,106.464346",
      },
    ],
  },

  // Opening letter to guests, shown in the "Lời Ngỏ" section
  foreword: [
    "Gửi đến gia đình và bạn bè thân mến,",
    "Trong ngày trọng đại sắp tới – khi chúng mình chính thức bắt đầu một chặng đường mới của cuộc đời, thật hạnh phúc và vinh dự biết bao khi được sẻ chia niềm vui ấy cùng mọi người.",
    "Chúng mình trân trọng kính mời bạn đến dự lễ cưới, cùng chung vui và lưu giữ những khoảnh khắc ý nghĩa bên nhau.",
    "Sự hiện diện của bạn sẽ là niềm vinh hạnh lớn lao và là món quà tinh thần tuyệt vời nhất đối với chúng mình.",
  ],

  // Shown in the "Thư Mời Cưới" invitation-letter block, after the guest's
  // name (resolved from the /for/<slug> link — see data/guests.js).
  invite: {
    heading: "Thư Mời Cưới",
    line1: "TRÂN TRỌNG KÍNH MỜI",
    line2: "ĐẾN DỰ BỮA TIỆC THÂN MẬT MỪNG LỄ THÀNH HÔN",
    line3: "CỦA HAI CHÚNG TÔI",
    closing: "Rất hân hạnh được đón tiếp!",
  },

  /*
   * Photos. Anywhere a photo is configured you can write either:
   *   - a bare name like "DSC_6854"  -> uses assets/img/thumb/DSC_6854.jpg for
   *     small views and assets/img/web/DSC_6854.jpg for large ones (both made
   *     by scripts/optimize-images.ps1 from the original assets/img/DSC_6854.JPG)
   *   - a local path ("assets/img/foo.jpg") or a full URL, used as-is.
   */
  photos: {
    cover: "DSC_6957",  // blurred backdrop behind the envelope (and on wide screens)
    hero: "DSC_6854",   // full-screen opening photo
    footer: "DSC_7988", // closing "thank you" photo
  },

  // Full-width photo pauses between sections — one per photo set ("chapter").
  interludes: [
    { photo: "DSC_7007", chapter: "Chương I · Ánh Sáng", quote: "Có những cái nắm tay, là để không bao giờ buông." },
    { photo: "DSC_7356", chapter: "Chương II · Sắc Đỏ", quote: "Hỷ sự đến nhà, đỏ thắm một lời hẹn ước trăm năm." },
    { photo: "DSC_7674", chapter: "Chương III · Tinh Khôi", quote: "Em là điệu nhạc dịu dàng nhất anh từng nghe." },
    { photo: "DSC_7917", chapter: "Chương IV · Dịu Dàng", quote: "Cảm ơn em đã đến, và đã ở lại." },
  ],

  // The album, grouped into chapters (shown as tabs). Add/remove freely.
  gallery: [
    {
      title: "Ánh Sáng",
      caption: "Nơi những ô cửa kính đón nắng, chúng mình bắt đầu câu chuyện.",
      photos: ["DSC_6809", "DSC_6854", "DSC_6798", "DSC_6824", "DSC_6857", "DSC_6916", "DSC_6945", "DSC_6957", "DSC_7007", "DSC_7053", "DSC_7072"],
    },
    {
      title: "Sắc Đỏ",
      caption: "Áo dài đỏ thắm, chữ Hỷ song đôi — lời hẹn của hai gia đình.",
      photos: ["DSC_7229", "DSC_7250", "DSC_7308", "DSC_7331", "DSC_7356", "DSC_7414"],
    },
    {
      title: "Tinh Khôi",
      caption: "Trắng trong như ngày đầu, nhẹ nhàng như hoa.",
      photos: ["DSC_7518", "DSC_7455", "DSC_7510", "DSC_7525", "DSC_7540", "DSC_7642", "DSC_7674", "DSC_7721", "DSC_7748", "DSC_7775"],
    },
    {
      title: "Dịu Dàng",
      caption: "Một chút hồng, một chút ngại ngùng, và rất nhiều yêu thương.",
      photos: ["DSC_7849", "DSC_7792", "DSC_7856", "DSC_7862", "DSC_7885", "DSC_7894", "DSC_7915", "DSC_7917", "DSC_7939", "DSC_7965", "DSC_7987", "DSC_7988", "DSC_8092"],
    },
  ],

  gift: {
    intro: "Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi. Nếu quý khách muốn gửi lời chúc phúc bằng một món quà nhỏ, chúng tôi xin trân trọng đón nhận qua thông tin bên dưới.",
    // `qr` is the bank app's own VietQR image. Without it, a plain QR is
    // generated from bankName/accountNumber/accountName (see qrUrlFor() in
    // assets/js/app.js). Remove an entry entirely to hide that card.
    groom: {
      bankName: "Vietcombank",
      accountName: "TO QUANG KHAI",
      accountNumber: "1017741150",
      qr: "assets/img/qr_code.jpg",
    },
  },

  // Short interface labels that are not part of the content above.
  labels: {
    saveQr: "Lưu mã QR",
    wishSent: "Cảm ơn lời chúc của bạn!",
  },

  music: {
    // Place your own royalty-free/licensed audio file at assets/audio/background-music.mp3
    src: "assets/audio/background-music.mp3",
    title: "Nothing's Gonna Change My Love For You",
    // Playback starts from this offset (seconds) the first time a guest opens the envelope
    startAt: 50,
  },

  // Leave empty to store wishes only in the visitor's browser (localStorage).
  // Set to a Formspree / Google Apps Script / other webhook URL to receive
  // wishes by email or into a spreadsheet. See README.md for setup guides.
  rsvp: {
    endpoint: "",
  },

  seo: {
    // The link-preview title itself lives in index.html's <head>.
    // Shown as the thumbnail when the link is shared on Zalo/Facebook/Messenger.
    // Must be an absolute URL (crawlers don't resolve relative ones); it is
    // baked into every page by scripts/generate.js.
    image: "https://khai-va-duong.github.io/wedding_invitation/assets/img/web/og-cover.jpg",
  },
};
