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

import { sign, config } from "/lib/es/web-eid.js";

function init() {
  const ui = {
    signButton:             document.getElementById("signButton"),
    postPrepareSigningUrl:  document.getElementById("postPrepareSigningUrl"),
    postFinalizeSigningUrl: document.getElementById("postFinalizeSigningUrl"),
    headers:                document.getElementById("signHeaders"),
    userInteractionTimeout: document.getElementById("signUserInteractionTimeout"),
    serverRequestTimeout:   document.getElementById("signServerRequestTimeout"),
    result:                 document.getElementById("signResult"),
  };

  ui.postPrepareSigningUrl.value        = window.location.origin + "/document/123/sign/prepare";
  ui.postFinalizeSigningUrl.value       = window.location.origin + "/document/123/sign/finalize";
  ui.headers.placeholder                = "{ }";
  ui.headers.value                      = '{ "X-Algorithm": "SHA-384" }';
  ui.userInteractionTimeout.placeholder = config.DEFAULT_USER_INTERACTION_TIMEOUT;
  ui.serverRequestTimeout.placeholder   = config.DEFAULT_SERVER_REQUEST_TIMEOUT;
  ui.result.value                       = "";

  ui.signButton.addEventListener("click", async () => {
    const headers                = JSON.parse(ui.headers.value || "{}");
    const userInteractionTimeout = ui.userInteractionTimeout.value;
    const serverRequestTimeout   = ui.serverRequestTimeout.value;

    const options = {
      postPrepareSigningUrl:  ui.postPrepareSigningUrl.value,
      postFinalizeSigningUrl: ui.postFinalizeSigningUrl.value,

      // Optional, included in options only when defined.
      ...(headers                ? { headers                } : {}),
      ...(userInteractionTimeout ? { userInteractionTimeout } : {}),
      ...(serverRequestTimeout   ? { serverRequestTimeout   } : {}),
    };

    ui.result.value = "";
    ui.signButton.disabled = true;

    try {
      const response = await sign(options);

      ui.result.value = (
        "Signing successful!" +
        "\n\n[response]\n" +
        JSON.stringify(response, null, "  ")
      );

    } catch (error) {
      ui.result.value = (
        "Signing failed!" +
        `\n\n[Code]\n${error.code}` +
        `\n\n[Message]\n${error.message}` +
        (
          (error.response)
            ? `\n\n[response]\n${JSON.stringify(error.response, null, "  ")}`
            : ""
        )
      );

      console.error(error)

      throw error;

    } finally {
      ui.signButton.disabled = false;
    }

  });
}

document.addEventListener("DOMContentLoaded", init);
