import React from "react";

class ChatwootWidget extends React.Component {
  componentDidMount() {
    // Add Chatwoot Settings
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: "left", // This can be left or right
      locale: "en", // Language to be set
      type: "standard", // [standard, expanded_bubble]
      launcherTitle: "Help", // Title of the launcher
    };

    // Paste the script from inbox settings except the <script> tag

    (function (d, t) {
      const BASE_URL = "https://app.chatwoot.com";
      const g = d.createElement(t) as any;
      const s = d.getElementsByTagName(t)[0] as any;
      g.src = BASE_URL + "/packs/js/sdk.js";
      g.defer = true;
      g.async = true;
      s.parentNode.insertBefore(g, s);
      g.onload = function () {
        window.chatwootSDK.run({
          websiteToken: "q1GtHySw24RzxzC2hkgdnwKr",
          baseUrl: BASE_URL,
        });
      };
    })(document, "script");
  }

  render() {
    return null;
  }
}

export default ChatwootWidget;
