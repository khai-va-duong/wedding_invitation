/**
 * Bride-side (Nhà Gái) overrides, loaded after data/config.js by the
 * nha-gai/ page only. Anything not set here is shared with the groom-side
 * invitation. Details follow the bride family's printed card.
 */
(function (config) {
  var couple = config.couple;
  // The bride's family lists her first everywhere (cover, letter, footer...).
  couple.bride.order = 1;
  couple.groom.order = 2;

  config.wedding.date = "2026-11-15T17:00:00+07:00";
  config.wedding.events = [
    {
      title: "Tiệc Mừng Lễ Vu Quy",
      description: "Bữa tiệc thân mật mừng lễ vu quy",
      date: "2026-11-15",
      time: "17:00",
      venue: "Tư Gia Nhà Gái",
      address: "Lô 125 Tái Định Cư Đồng Hoà 1 - Kiến An - TP. Hải Phòng",
      // Same pin as the location QR on the bride family's printed card.
      mapUrl: "https://www.google.com/maps?q=20.830118,106.660011",
    },
  ];

  config.invite.line2 = "ĐẾN DỰ BỮA TIỆC THÂN MẬT MỪNG LỄ VU QUY";

  // Only the bride's account is shown on this page.
  config.gift.groom = null;
  config.gift.bride = {
    bankName: "MB Bank",
    // Not encoded in the VietQR image; fill in to show it on the card.
    accountName: "",
    accountNumber: "0818183326",
    qr: "assets/img/qr_code_bride.png",
  };
})(window.SITE_CONFIG);
