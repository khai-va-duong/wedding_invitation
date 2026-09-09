/**
 * Site-wide configuration. Edit this file to customize the invitation
 * for your own wedding — no other file needs to change for basic use.
 */
window.SITE_CONFIG = {
  couple: {
    groom: {
      name: "Quang Khải",
      fullName: "Nguyễn Quang Khải",
      parents: "Ông Nguyễn Văn Khoa & Bà Trần Thị Hoa",
      photo: "assets/img/groom.svg",
      quote: "Khoảnh khắc gặp được em, anh đã quyết định sẽ cùng em đi đến hết cuộc đời.",
      order: 1, // shown first
    },
    bride: {
      name: "ABC Dương",
      fullName: "Lê ABC Dương",
      parents: "Ông Lê Văn Sơn & Bà Phạm Thị Lan",
      photo: "assets/img/bride.svg",
      quote: "Giữa thế gian huyên náo, anh là lý do để em mỉm cười mỗi ngày.",
      order: 2,
    },
    // Used for the big cover title, e.g. "Quang Khải & ABC Dương"
    separator: "&",
    // Small cover-page copy
    badge: "SWEET WEDDING",
    tagline: "Together Forever",
    marryPrompt: "MARRY ME?",
    marryAnswer: "YES! I DO",
    quote: "Hôn nhân là chuyện cả đời, yêu người vừa ý, cưới người mình thương.",
  },

  wedding: {
    // ISO date used by the countdown timer
    date: "2026-12-20T11:00:00+07:00",
    lunarDate: "Ngày 12 tháng 11 năm Bính Ngọ",
    hashtag: "#QuangKhaiVaDuong2026",
    // Ceremony timeline, shown as cards in order
    events: [
      {
        title: "Lễ Vu Quy",
        description: "Nhà gái tổ chức lễ đón dâu",
        date: "2026-12-19",
        time: "09:00",
        venue: "Tư gia nhà gái",
        address: "123 Đường ABC, Phường 1, Quận XYZ, TP. Hồ Chí Minh",
        mapUrl: "https://maps.google.com/?q=123+Duong+ABC+TP+Ho+Chi+Minh",
      },
      {
        title: "Lễ Thành Hôn",
        description: "Tiệc cưới thân mật tại nhà hàng",
        date: "2026-12-20",
        time: "11:00",
        venue: "Trung tâm Hội nghị Tiệc cưới Hoa Sen",
        address: "456 Đường DEF, Phường 2, Quận UVW, TP. Hồ Chí Minh",
        mapUrl: "https://maps.google.com/?q=456+Duong+DEF+TP+Ho+Chi+Minh",
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

  // Love story timeline (optional — leave the array empty to hide the section)
  story: [
    { year: "2020", title: "Gặp gỡ", text: "Hai người tình cờ quen nhau qua một người bạn chung." },
    { year: "2022", title: "Hẹn hò", text: "Bắt đầu một hành trình yêu thương và thấu hiểu." },
    { year: "2026", title: "Về chung một nhà", text: "Và hôm nay, chúng tôi quyết định gắn bó trọn đời." },
  ],

  gallery: [
    "assets/img/gallery/1.svg",
    "assets/img/gallery/2.svg",
    "assets/img/gallery/3.svg",
    "assets/img/gallery/4.svg",
    "assets/img/gallery/5.svg",
    "assets/img/gallery/6.svg",
  ],

  gift: {
    intro: "Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi. Nếu quý khách muốn gửi lời chúc phúc bằng một món quà nhỏ, chúng tôi xin trân trọng đón nhận qua thông tin bên dưới.",
    groom: {
      bankName: "Vietcombank",
      accountName: "NGUYEN QUANG KHAI",
      accountNumber: "0123456789",
      qr: "assets/img/qr-groom.svg",
    },
    bride: {
      bankName: "Techcombank",
      accountName: "LE ABC DUONG",
      accountNumber: "9876543210",
      qr: "assets/img/qr-bride.svg",
    },
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
    // Link-preview title becomes: "{titlePrefix} {guest title + name} {titleSuffix}"
    // e.g. "Thân mời chị Liên | Ngày chung đôi"
    titlePrefix: "Thân mời",
    titleSuffix: "| Ngày chung đôi",
    defaultGuestLabel: "bạn",
    // Link-preview description/subtitle, same for every guest
    subtitle: "đến dự buổi tiệc chung vui cùng gia đình",
    // Replace with a hosted image URL for rich link previews on Zalo/Facebook/Messenger
    image: "assets/img/cover-share.svg",
  },
};
