/*
 * Copyright (c) 2020-2023 Estonian Information System Authority
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

function init() {
  const ui = {
    tokenSigning: document.getElementById("tokenSigning"),
    links:        document.getElementsByTagName("a"),
  };

  const params          = new URLSearchParams(location.search);
  const hasTokenSigning = params.get("tokenSigning") === "true";

  ui.tokenSigning.checked = hasTokenSigning;

  if (hasTokenSigning) {
    [...ui.links].forEach((link) => {
      link.href += "?tokenSigning=true";
    });
  }

  ui.tokenSigning.addEventListener("change", () => {
    if (ui.tokenSigning.checked) {
      window.location.replace("/?tokenSigning=true");
    } else {
      window.location.replace("/");
    }
  });
}

document.addEventListener("DOMContentLoaded", init);
