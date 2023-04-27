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

function updateTableContent(status) {
  const ui = {
    library:   document.querySelector("#status-library"),
    extension: document.querySelector("#status-extension"),
    nativeApp: document.querySelector("#status-native"),
    message:   document.querySelector("#status-message"),
  };

  Object.keys(ui).forEach((key) => {
    if (status[key]) {
      ui[key].innerText = status[key];
    }
  });
}

function setTableClass(className) {
  document.querySelector("#status").classList.add(className);
}

async function init() {

  updateTableContent({
    message: "waiting for hwcrypto.js, TokenSigning extension and native app versions",
  });

  try {
    // Google Chrome extensions are not available right after DOMContentLoaded.
    // Calling hwcrypto functions before chrome-token-signing extension is ready
    // causes hwcrypto to fail the extension detection permanently.
    await new Promise((resolve) => setTimeout(resolve));

    const debugResult = await window.hwcrypto.debug();

    const [hwcryptoVersion, extensionVersion] = debugResult.split(" with ");

    if (extensionVersion.startsWith("failing")) {
      updateTableContent({
        library: hwcryptoVersion,
        message: extensionVersion,
      });
      setTableClass("failure");
    } else {
      const [browserExtensionVersion, nativeAppVersion] = extensionVersion.split("/");

      updateTableContent({
        library:   hwcryptoVersion,
        extension: browserExtensionVersion,
        nativeApp: nativeAppVersion,
        message:   "Ok!",
      })
      setTableClass("success");
    }

  } catch (error) {
    updateTableContent({
      message: error.message,
    });

    setTableClass("failure");

    throw error;
  }
}

document.addEventListener("DOMContentLoaded", init);
