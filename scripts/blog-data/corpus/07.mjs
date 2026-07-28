export default {
  "slug": "qr-code-pairing-security",
  "pubDate": "2026-03-05",
  "tags": [
    "privacy",
    "security",
    "pairing"
  ],
  "locales": {
    "en": {
      "title": "QR code pairing security",
      "description": "QR codes exchange signaling data, not file contents. Use them wisely to bootstrap encrypted WebRTC sessions.",
      "intro": "QR codes make it easy to move a chunk of signaling text from one phone to a laptop camera without typos. They are not magic shields: anyone who scans the code within its lifetime can attempt to join the session. Treat QR like a temporary password displayed on your screen. [PrivateDrop](/transfer) pairing assumes you show the code only to the intended recipient. If you need a deeper threat model, continue with [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect). Technical background lives in [WebRTC explained for everyone](/blog/webrtc-explained-for-everyone). The following sections walk through concrete habits—not slogans—so you can explain the workflow to security reviewers and to colleagues who are not steeped in WebRTC jargon.",
      "sections": [
        [
          "What the QR actually encodes",
          "Typically you are encoding session descriptions or short tokens, not the file bytes. That keeps the QR small and scannable, but sensitive nonetheless. After scan, browsers still negotiate keys over DTLS. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Shoulder surfing and screenshots",
          "Open offices and video calls leak QR codes constantly. Hide the screen, use physical proximity, or switch to copy-paste over an already trusted channel. Rotate pairing if you suspect exposure. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Rotation and expiry",
          "Short-lived signaling reduces the window for guessing or replay. If a session fails, generate fresh material instead of reusing old codes publicly. Document this in team runbooks. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Human verification",
          "Ask recipients to confirm a random word or file name before sending sensitive payloads. Machines negotiate crypto; humans prevent wrong-person mistakes. Combine with [no accounts, no tracking](/blog/no-accounts-no-tracking) flows when identity is social. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ],
      "faq": [
        [
          "Is QR safer than a link?",
          "Links encourage forwarding; QR is safer only when shown privately and expires quickly. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "What if someone photographs it?",
          "Assume compromise: abort and regenerate signaling. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Can I use text only?",
          "Yes—paste signaling through a channel you already trust, like an encrypted messenger. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ]
    },
    "pt": {
      "title": "QR code pairing security",
      "description": "QR codes exchange signaling data, not file contents. Use them wisely to bootstrap encrypted WebRTC sessions.",
      "intro": "QR codes make it easy to move a chunk of signaling text from one phone to a laptop camera without typos. They are not magic shields: anyone who scans the code within its lifetime can attempt to join the session. Treat QR like a temporary password displayed on your screen. [PrivateDrop](/transfer) pairing assumes you show the code only to the intended recipient. If you need a deeper threat model, continue with [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect). Technical background lives in [WebRTC explained for everyone](/blog/webrtc-explained-for-everyone). The following sections walk through concrete habits—not slogans—so you can explain the workflow to security reviewers and to colleagues who are not steeped in WebRTC jargon.",
      "sections": [
        [
          "What the QR actually encodes",
          "Typically you are encoding session descriptions or short tokens, not the file bytes. That keeps the QR small and scannable, but sensitive nonetheless. After scan, browsers still negotiate keys over DTLS. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Shoulder surfing and screenshots",
          "Open offices and video calls leak QR codes constantly. Hide the screen, use physical proximity, or switch to copy-paste over an already trusted channel. Rotate pairing if you suspect exposure. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Rotation and expiry",
          "Short-lived signaling reduces the window for guessing or replay. If a session fails, generate fresh material instead of reusing old codes publicly. Document this in team runbooks. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Human verification",
          "Ask recipients to confirm a random word or file name before sending sensitive payloads. Machines negotiate crypto; humans prevent wrong-person mistakes. Combine with [no accounts, no tracking](/blog/no-accounts-no-tracking) flows when identity is social. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ],
      "faq": [
        [
          "Is QR safer than a link?",
          "Links encourage forwarding; QR is safer only when shown privately and expires quickly. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "What if someone photographs it?",
          "Assume compromise: abort and regenerate signaling. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Can I use text only?",
          "QUERY LENGTH LIMIT EXCEEDED. MAX ALLOWED QUERY : 500 CHARS"
        ]
      ]
    },
    "es": {
      "title": "QR code pairing security",
      "description": "QR codes exchange signaling data, not file contents. Use them wisely to bootstrap encrypted WebRTC sessions.",
      "intro": "QR codes make it easy to move a chunk of signaling text from one phone to a laptop camera without typos. They are not magic shields: anyone who scans the code within its lifetime can attempt to join the session. Treat QR like a temporary password displayed on your screen. [PrivateDrop](/transfer) pairing assumes you show the code only to the intended recipient. If you need a deeper threat model, continue with [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect). Technical background lives in [WebRTC explained for everyone](/blog/webrtc-explained-for-everyone). The following sections walk through concrete habits—not slogans—so you can explain the workflow to security reviewers and to colleagues who are not steeped in WebRTC jargon.",
      "sections": [
        [
          "What the QR actually encodes",
          "Typically you are encoding session descriptions or short tokens, not the file bytes. That keeps the QR small and scannable, but sensitive nonetheless. After scan, browsers still negotiate keys over DTLS. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Shoulder surfing and screenshots",
          "Open offices and video calls leak QR codes constantly. Hide the screen, use physical proximity, or switch to copy-paste over an already trusted channel. Rotate pairing if you suspect exposure. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Rotation and expiry",
          "Short-lived signaling reduces the window for guessing or replay. If a session fails, generate fresh material instead of reusing old codes publicly. Document this in team runbooks. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Human verification",
          "Ask recipients to confirm a random word or file name before sending sensitive payloads. Machines negotiate crypto; humans prevent wrong-person mistakes. Combine with [no accounts, no tracking](/blog/no-accounts-no-tracking) flows when identity is social. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ],
      "faq": [
        [
          "Is QR safer than a link?",
          "Links encourage forwarding; QR is safer only when shown privately and expires quickly. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "What if someone photographs it?",
          "Assume compromise: abort and regenerate signaling. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Can I use text only?",
          "QUERY LENGTH LIMIT EXCEEDED. MAX ALLOWED QUERY : 500 CHARS"
        ]
      ]
    },
    "fr": {
      "title": "QR code pairing security",
      "description": "QR codes exchange signaling data, not file contents. Use them wisely to bootstrap encrypted WebRTC sessions.",
      "intro": "QR codes make it easy to move a chunk of signaling text from one phone to a laptop camera without typos. They are not magic shields: anyone who scans the code within its lifetime can attempt to join the session. Treat QR like a temporary password displayed on your screen. [PrivateDrop](/transfer) pairing assumes you show the code only to the intended recipient. If you need a deeper threat model, continue with [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect). Technical background lives in [WebRTC explained for everyone](/blog/webrtc-explained-for-everyone). The following sections walk through concrete habits—not slogans—so you can explain the workflow to security reviewers and to colleagues who are not steeped in WebRTC jargon.",
      "sections": [
        [
          "What the QR actually encodes",
          "Typically you are encoding session descriptions or short tokens, not the file bytes. That keeps the QR small and scannable, but sensitive nonetheless. After scan, browsers still negotiate keys over DTLS. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Shoulder surfing and screenshots",
          "Open offices and video calls leak QR codes constantly. Hide the screen, use physical proximity, or switch to copy-paste over an already trusted channel. Rotate pairing if you suspect exposure. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Rotation and expiry",
          "Short-lived signaling reduces the window for guessing or replay. If a session fails, generate fresh material instead of reusing old codes publicly. Document this in team runbooks. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Human verification",
          "Ask recipients to confirm a random word or file name before sending sensitive payloads. Machines negotiate crypto; humans prevent wrong-person mistakes. Combine with [no accounts, no tracking](/blog/no-accounts-no-tracking) flows when identity is social. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ],
      "faq": [
        [
          "Is QR safer than a link?",
          "Links encourage forwarding; QR is safer only when shown privately and expires quickly. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "What if someone photographs it?",
          "Assume compromise: abort and regenerate signaling. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Can I use text only?",
          "QUERY LENGTH LIMIT EXCEEDED. MAX ALLOWED QUERY : 500 CHARS"
        ]
      ]
    },
    "zh": {
      "title": "QR code pairing security",
      "description": "QR codes exchange signaling data, not file contents. Use them wisely to bootstrap encrypted WebRTC sessions.",
      "intro": "QR codes make it easy to move a chunk of signaling text from one phone to a laptop camera without typos. They are not magic shields: anyone who scans the code within its lifetime can attempt to join the session. Treat QR like a temporary password displayed on your screen. [PrivateDrop](/transfer) pairing assumes you show the code only to the intended recipient. If you need a deeper threat model, continue with [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect). Technical background lives in [WebRTC explained for everyone](/blog/webrtc-explained-for-everyone). The following sections walk through concrete habits—not slogans—so you can explain the workflow to security reviewers and to colleagues who are not steeped in WebRTC jargon.",
      "sections": [
        [
          "What the QR actually encodes",
          "Typically you are encoding session descriptions or short tokens, not the file bytes. That keeps the QR small and scannable, but sensitive nonetheless. After scan, browsers still negotiate keys over DTLS. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Shoulder surfing and screenshots",
          "Open offices and video calls leak QR codes constantly. Hide the screen, use physical proximity, or switch to copy-paste over an already trusted channel. Rotate pairing if you suspect exposure. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Rotation and expiry",
          "Short-lived signaling reduces the window for guessing or replay. If a session fails, generate fresh material instead of reusing old codes publicly. Document this in team runbooks. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Human verification",
          "Ask recipients to confirm a random word or file name before sending sensitive payloads. Machines negotiate crypto; humans prevent wrong-person mistakes. Combine with [no accounts, no tracking](/blog/no-accounts-no-tracking) flows when identity is social. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ],
      "faq": [
        [
          "Is QR safer than a link?",
          "Links encourage forwarding; QR is safer only when shown privately and expires quickly. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "What if someone photographs it?",
          "Assume compromise: abort and regenerate signaling. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Can I use text only?",
          "QUERY LENGTH LIMIT EXCEEDED. MAX ALLOWED QUERY : 500 CHARS"
        ]
      ]
    }
  }
};
