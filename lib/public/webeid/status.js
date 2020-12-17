/*
 * Copyright (c) 2020 The Web eID Project
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

import * as webeid from "/lib/es/web-eid.js";

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
    message: "waiting for Web-eID extension and native app versions",
  });

  try {
    const status = await webeid.status();

    updateTableContent({
      ...status,
      message: "OK!",
    });

    setTableClass("success");

  } catch (error) {
    if (webeid.hasVersionProperties(error)) {
      updateTableContent({
        ...error,
        message: error.message || "Not OK!",
      });
    } else {
      updateTableContent({
        message: error.message,
      });
    }

    setTableClass("failure");

    throw error;
  }
}

document.addEventListener("DOMContentLoaded", init);
