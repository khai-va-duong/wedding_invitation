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
      father: "Nguyễn Văn Khoa",
      mother: "Trần Thị Hoa",
      address: "SN 130A Đặng Quang - TDP 5, P. Quang Trung - Thanh Hóa",
      // Replace with your own photo (a hosted URL, or a local file under assets/img/)
      photo: "https://images.unsplash.com/photo-1553455274-5297e1a79c49?w=400&h=400&q=80&auto=format&fit=crop",
      quote: "Khoảnh khắc gặp được em, anh đã quyết định sẽ cùng em đi đến hết cuộc đời.",
      order: 1, // shown first
    },
    bride: {
      name: "ABC Dương",
      fullName: "Lê ABC Dương",
      parents: "Ông Lê Văn Sơn & Bà Phạm Thị Lan",
      father: "Lê Văn Sơn",
      mother: "Phạm Thị Lan",
      address: "Thôn Thanh Vòng, Xã Thanh Vân - Bắc Ninh",
      // Replace with your own photo (a hosted URL, or a local file under assets/img/)
      photo: "https://images.unsplash.com/photo-1766416143515-302f0e5ccbee?w=400&h=400&q=80&auto=format&fit=crop",
      quote: "Giữa thế gian huyên náo, anh là lý do để em mỉm cười mỗi ngày.",
      order: 2,
    },
    // Used for the big cover title, e.g. "Quang Khải & ABC Dương"
    separator: "&",
    // Small cover-page copy
    badge: "SWEET WEDDING",
    tagline: "Together Forever",
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

  // Shown in the "Thư Mời Cưới" invitation-letter block, after the guest's
  // name (resolved from the /for/<slug> link — see data/guests.js).
  invite: {
    heading: "Thư Mời Cưới",
    line1: "TRÂN TRỌNG KÍNH MỜI",
    line2: "ĐẾN DỰ BUỔI TIỆC VÀ",
    line3: "CHUNG VUI CÙNG GIA ĐÌNH CHÚNG TÔI!",
  },

  // Replace with your own wedding photos (hosted URLs, or local files under
  // assets/img/) once you have them — these are real placeholder photography
  // (Unsplash, free to use) so the page looks finished in the meantime.
  gallery: [
    "https://images.unsplash.com/photo-1596457221755-b96bc3a6df18?w=700&h=700&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1717578899442-7a9e55267903?w=700&h=700&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1595919994909-0f80404101dd?w=700&h=700&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1718183442384-921bf92d2edf?w=700&h=700&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1721401870202-8e2264ecced2?w=700&h=700&q=80&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1563476241873-3a74ddd9fa4c?w=700&h=700&q=80&auto=format&fit=crop",
  ],

  gift: {
    intro: "Sự hiện diện của quý khách là niềm vinh hạnh cho gia đình chúng tôi. Nếu quý khách muốn gửi lời chúc phúc bằng một món quà nhỏ, chúng tôi xin trân trọng đón nhận qua thông tin bên dưới.",
    // QR codes are generated automatically from bankName/accountNumber/accountName
    // below (see qrUrlFor() in assets/js/app.js) — edit those fields and the QR
    // updates itself, no image file to replace.
    groom: {
      bankName: "Vietcombank",
      accountName: "NGUYEN QUANG KHAI",
      accountNumber: "0123456789",
    },
    bride: {
      bankName: "Techcombank",
      accountName: "LE ABC DUONG",
      accountNumber: "9876543210",
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
    // Shown as the thumbnail when the link is shared on Zalo/Facebook/Messenger
    image: "https://images.unsplash.com/photo-1596457221755-b96bc3a6df18?w=1200&h=630&q=80&auto=format&fit=crop",
  },
};
