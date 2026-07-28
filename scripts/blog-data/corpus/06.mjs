export default {
  "slug": "end-to-end-encryption-in-the-browser",
  "pubDate": "2026-02-25",
  "tags": [
    "privacy",
    "encryption"
  ],
  "locales": {
    "en": {
      "title": "End-to-end encryption in the browser",
      "description": "Transport security in WebRTC protects bytes between peers, while endpoint hygiene protects decrypted content on devices.",
      "intro": "Marketing teams throw “end-to-end encrypted” on slide decks, but browsers mix several layers: HTTPS to load the app, WebRTC DTLS between peers, and whatever the operating system does afterward. Understanding the stack prevents buying a false sense of safety. In [PrivateDrop](/transfer), file chunks ride encrypted data channels rather than resting on a shared drive. E2E does not scan your malware or stop you from forwarding plaintext exports. Pair transport security with [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect). For pairing integrity, see [QR code pairing security](/blog/qr-code-pairing-security). The following sections walk through concrete habits—not slogans—so you can explain the workflow to security reviewers and to colleagues who are not steeped in WebRTC jargon.",
      "sections": [
        [
          "Layers of encryption",
          "TLS protects the initial page and APIs from tampering on the wire. WebRTC uses DTLS to negotiate keys for peer connections and SCTP data channels. Those keys are ephemeral per session, which limits retrospective decryption if endpoints are clean. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "What stays outside the tunnel",
          "File names you type into support tickets, screenshots of QR codes, and email subjects remain visible to whatever handles those channels. Server-side signaling logs—if they exist—may store connection metadata under retention policies. Minimize what you paste into chat when coordinating a session. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Keys and trust",
          "Browsers validate certificates for HTTPS; WebRTC fingerprints bind peers during signaling. If an attacker replaces signaling, they could stage a machine-in-the-middle despite encryption to them. Verify fingerprints through a second channel when stakes are high. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Operational best practices",
          "Patch browsers, lock screens, and disk encryption matter as much as cipher suites. Use corporate-approved devices for regulated data. When encryption cannot run because networks block UDP, do not bypass policy with personal upload accounts. Read [corporate networks and P2P](/blog/corporate-networks-and-p2p). Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ],
      "faq": [
        [
          "Does E2E block cloud antivirus?",
          "There is no cloud copy to scan in pure P2P transfer; endpoint AV still applies. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Can I verify manually?",
          "Compare signaling fingerprints or QR sources in person when possible. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "How does QR help?",
          "QR moves signaling locally without publishing secrets to wide channels. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ]
    },
    "pt": {
      "title": "End-to-end encryption in the browser",
      "description": "Transport security in WebRTC protects bytes between peers, while endpoint hygiene protects decrypted content on devices.",
      "intro": "Marketing teams throw “end-to-end encrypted” on slide decks, but browsers mix several layers: HTTPS to load the app, WebRTC DTLS between peers, and whatever the operating system does afterward. Understanding the stack prevents buying a false sense of safety. In [PrivateDrop](/transfer), file chunks ride encrypted data channels rather than resting on a shared drive. E2E does not scan your malware or stop you from forwarding plaintext exports. Pair transport security with [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect). For pairing integrity, see [QR code pairing security](/blog/qr-code-pairing-security). The following sections walk through concrete habits—not slogans—so you can explain the workflow to security reviewers and to colleagues who are not steeped in WebRTC jargon.",
      "sections": [
        [
          "Layers of encryption",
          "TLS protects the initial page and APIs from tampering on the wire. WebRTC uses DTLS to negotiate keys for peer connections and SCTP data channels. Those keys are ephemeral per session, which limits retrospective decryption if endpoints are clean. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "What stays outside the tunnel",
          "File names you type into support tickets, screenshots of QR codes, and email subjects remain visible to whatever handles those channels. Server-side signaling logs—if they exist—may store connection metadata under retention policies. Minimize what you paste into chat when coordinating a session. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Keys and trust",
          "Browsers validate certificates for HTTPS; WebRTC fingerprints bind peers during signaling. If an attacker replaces signaling, they could stage a machine-in-the-middle despite encryption to them. Verify fingerprints through a second channel when stakes are high. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Operational best practices",
          "Patch browsers, lock screens, and disk encryption matter as much as cipher suites. Use corporate-approved devices for regulated data. When encryption cannot run because networks block UDP, do not bypass policy with personal upload accounts. Read [corporate networks and P2P](/blog/corporate-networks-and-p2p). Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ],
      "faq": [
        [
          "Does E2E block cloud antivirus?",
          "There is no cloud copy to scan in pure P2P transfer; endpoint AV still applies. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Can I verify manually?",
          "Compare signaling fingerprints or QR sources in person when possible. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "How does QR help?",
          "QUERY LENGTH LIMIT EXCEEDED. MAX ALLOWED QUERY : 500 CHARS"
        ]
      ]
    },
    "es": {
      "title": "End-to-end encryption in the browser",
      "description": "Transport security in WebRTC protects bytes between peers, while endpoint hygiene protects decrypted content on devices.",
      "intro": "Marketing teams throw “end-to-end encrypted” on slide decks, but browsers mix several layers: HTTPS to load the app, WebRTC DTLS between peers, and whatever the operating system does afterward. Understanding the stack prevents buying a false sense of safety. In [PrivateDrop](/transfer), file chunks ride encrypted data channels rather than resting on a shared drive. E2E does not scan your malware or stop you from forwarding plaintext exports. Pair transport security with [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect). For pairing integrity, see [QR code pairing security](/blog/qr-code-pairing-security). The following sections walk through concrete habits—not slogans—so you can explain the workflow to security reviewers and to colleagues who are not steeped in WebRTC jargon.",
      "sections": [
        [
          "Layers of encryption",
          "TLS protects the initial page and APIs from tampering on the wire. WebRTC uses DTLS to negotiate keys for peer connections and SCTP data channels. Those keys are ephemeral per session, which limits retrospective decryption if endpoints are clean. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "What stays outside the tunnel",
          "File names you type into support tickets, screenshots of QR codes, and email subjects remain visible to whatever handles those channels. Server-side signaling logs—if they exist—may store connection metadata under retention policies. Minimize what you paste into chat when coordinating a session. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Keys and trust",
          "Browsers validate certificates for HTTPS; WebRTC fingerprints bind peers during signaling. If an attacker replaces signaling, they could stage a machine-in-the-middle despite encryption to them. Verify fingerprints through a second channel when stakes are high. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Operational best practices",
          "Patch browsers, lock screens, and disk encryption matter as much as cipher suites. Use corporate-approved devices for regulated data. When encryption cannot run because networks block UDP, do not bypass policy with personal upload accounts. Read [corporate networks and P2P](/blog/corporate-networks-and-p2p). Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ],
      "faq": [
        [
          "Does E2E block cloud antivirus?",
          "There is no cloud copy to scan in pure P2P transfer; endpoint AV still applies. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Can I verify manually?",
          "Compare signaling fingerprints or QR sources in person when possible. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "How does QR help?",
          "QUERY LENGTH LIMIT EXCEEDED. MAX ALLOWED QUERY : 500 CHARS"
        ]
      ]
    },
    "fr": {
      "title": "End-to-end encryption in the browser",
      "description": "Transport security in WebRTC protects bytes between peers, while endpoint hygiene protects decrypted content on devices.",
      "intro": "Marketing teams throw “end-to-end encrypted” on slide decks, but browsers mix several layers: HTTPS to load the app, WebRTC DTLS between peers, and whatever the operating system does afterward. Understanding the stack prevents buying a false sense of safety. In [PrivateDrop](/transfer), file chunks ride encrypted data channels rather than resting on a shared drive. E2E does not scan your malware or stop you from forwarding plaintext exports. Pair transport security with [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect). For pairing integrity, see [QR code pairing security](/blog/qr-code-pairing-security). The following sections walk through concrete habits—not slogans—so you can explain the workflow to security reviewers and to colleagues who are not steeped in WebRTC jargon.",
      "sections": [
        [
          "Layers of encryption",
          "TLS protects the initial page and APIs from tampering on the wire. WebRTC uses DTLS to negotiate keys for peer connections and SCTP data channels. Those keys are ephemeral per session, which limits retrospective decryption if endpoints are clean. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "What stays outside the tunnel",
          "File names you type into support tickets, screenshots of QR codes, and email subjects remain visible to whatever handles those channels. Server-side signaling logs—if they exist—may store connection metadata under retention policies. Minimize what you paste into chat when coordinating a session. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Keys and trust",
          "Browsers validate certificates for HTTPS; WebRTC fingerprints bind peers during signaling. If an attacker replaces signaling, they could stage a machine-in-the-middle despite encryption to them. Verify fingerprints through a second channel when stakes are high. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Operational best practices",
          "Patch browsers, lock screens, and disk encryption matter as much as cipher suites. Use corporate-approved devices for regulated data. When encryption cannot run because networks block UDP, do not bypass policy with personal upload accounts. Read [corporate networks and P2P](/blog/corporate-networks-and-p2p). Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ],
      "faq": [
        [
          "Does E2E block cloud antivirus?",
          "There is no cloud copy to scan in pure P2P transfer; endpoint AV still applies. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Can I verify manually?",
          "Compare signaling fingerprints or QR sources in person when possible. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "How does QR help?",
          "QUERY LENGTH LIMIT EXCEEDED. MAX ALLOWED QUERY : 500 CHARS"
        ]
      ]
    },
    "zh": {
      "title": "End-to-end encryption in the browser",
      "description": "Transport security in WebRTC protects bytes between peers, while endpoint hygiene protects decrypted content on devices.",
      "intro": "Marketing teams throw “end-to-end encrypted” on slide decks, but browsers mix several layers: HTTPS to load the app, WebRTC DTLS between peers, and whatever the operating system does afterward. Understanding the stack prevents buying a false sense of safety. In [PrivateDrop](/transfer), file chunks ride encrypted data channels rather than resting on a shared drive. E2E does not scan your malware or stop you from forwarding plaintext exports. Pair transport security with [what P2P does and does not protect](/blog/what-p2p-does-and-does-not-protect). For pairing integrity, see [QR code pairing security](/blog/qr-code-pairing-security). The following sections walk through concrete habits—not slogans—so you can explain the workflow to security reviewers and to colleagues who are not steeped in WebRTC jargon.",
      "sections": [
        [
          "Layers of encryption",
          "TLS protects the initial page and APIs from tampering on the wire. WebRTC uses DTLS to negotiate keys for peer connections and SCTP data channels. Those keys are ephemeral per session, which limits retrospective decryption if endpoints are clean. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "What stays outside the tunnel",
          "File names you type into support tickets, screenshots of QR codes, and email subjects remain visible to whatever handles those channels. Server-side signaling logs—if they exist—may store connection metadata under retention policies. Minimize what you paste into chat when coordinating a session. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Keys and trust",
          "Browsers validate certificates for HTTPS; WebRTC fingerprints bind peers during signaling. If an attacker replaces signaling, they could stage a machine-in-the-middle despite encryption to them. Verify fingerprints through a second channel when stakes are high. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Operational best practices",
          "Patch browsers, lock screens, and disk encryption matter as much as cipher suites. Use corporate-approved devices for regulated data. When encryption cannot run because networks block UDP, do not bypass policy with personal upload accounts. Read [corporate networks and P2P](/blog/corporate-networks-and-p2p). Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ]
      ],
      "faq": [
        [
          "Does E2E block cloud antivirus?",
          "There is no cloud copy to scan in pure P2P transfer; endpoint AV still applies. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "Can I verify manually?",
          "Compare signaling fingerprints or QR sources in person when possible. Operational teams should capture who approved the transfer, which device class was used, and whether signaling was rotated after any failed attempt. Privacy wins compound when you pair technology choices with habit: fewer permanent links, more intentional pairing, and clear escalation when networks block direct paths."
        ],
        [
          "How does QR help?",
          "QUERY LENGTH LIMIT EXCEEDED. MAX ALLOWED QUERY : 500 CHARS"
        ]
      ]
    }
  }
};
