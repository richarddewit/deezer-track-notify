/**********************************************************************************\

  Deezer Track Notify | MIT License
  Copyright (c) 2018 Richard de Wit

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
  of the Software, and to permit persons to whom the Software is furnished to do
  so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.

  All trademarks, service marks, trade names, trade dress, product names and logos
  appearing in this extension are the property of their respective owners.

\**********************************************************************************/

(function () {
  "use strict";
  if (document.readyState === "complete") {
    init();
  } else {
    window.onload = init;
  }

  function init() {
    const id = "deezer-track-notify";
    const previousSelector = ".controls .control-prev";
    const nextSelector = ".controls .control-next";
    const pollInterval = 1000;
    const channel = chrome.extension.connect({
      name: id
    });
    let trackInfo = "";

    const observer = setInterval(function () {
        let ti = [
          document.querySelector(".player .player-track-title").innerText,
          document.querySelector(".player .player-track-artist").innerText,
        ].join("\n");
        if (ti !== trackInfo) {
          let coverImage;
          try {
            coverImage = document.querySelector(".player .player-cover img").src;
          } catch (e) {}

          trackInfo = ti;
          channel.postMessage(["TRACK_CHANGED", trackInfo, coverImage]);
        }
      },
      pollInterval);

    channel.onMessage.addListener((msg, channel) => {
      if (channel.name === id) {
        switch (msg) {
          case "GO_BACK":
            document.querySelector(previousSelector).click();
            break;

          case "GO_FORWARD":
            document.querySelector(nextSelector).click();
            break;
        }
      }
    });
  }
})();
