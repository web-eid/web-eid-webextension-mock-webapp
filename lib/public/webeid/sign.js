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

import {
  config,
  getSigningCertificate,
  sign,
} from "/lib/es/web-eid.js";

import httpErrorHandler from "../utils/httpErrorHandler.js";

function init() {
  const $options = document.querySelector(".sign.options");

  const ui = {
    signButton: document.querySelector("[name='signButton']"),
    result:     document.querySelector("[name='signResult']"),

    prepareSigning: {
      url:     $options.querySelector("[name='postPrepareSigningUrl']"),
      headers: $options.querySelector("[name='postPrepareSigningHeaders']"),
    },
    finalizeSigning: {
      url:     $options.querySelector("[name='postFinalizeSigningUrl']"),
      headers: $options.querySelector("[name='postFinalizeSigningHeaders']"),
    },

    userInteractionTimeout: $options.querySelector("[name='signUserInteractionTimeout']"),
    signLanguage:           $options.querySelector("[name='signLanguage']"),
  };

  ui.prepareSigning.url.value            = window.location.origin + "/document/123/sign/prepare";
  ui.prepareSigning.headers.value        = '{ "Content-Type": "application/json", "X-Hash-Function": "SHA-384" }';
  ui.prepareSigning.headers.placeholder  = "{ }";
  ui.finalizeSigning.url.value           = window.location.origin + "/document/123/sign/finalize";
  ui.finalizeSigning.headers.value       = '{ "Content-Type": "application/json" }';
  ui.finalizeSigning.headers.placeholder = "{ }";
  ui.userInteractionTimeout.placeholder  = config.DEFAULT_USER_INTERACTION_TIMEOUT;
  ui.result.value                        = "";

  ui.signButton.addEventListener("click", async () => {
    const userInteractionTimeout  = (
      ui.userInteractionTimeout.value
        ? parseInt(ui.userInteractionTimeout.value)
        : undefined
    );

    const lang = ui.signLanguage.value;

    ui.result.value = "";
    ui.signButton.disabled = true;

    try {
      const {
        certificate,
        supportedSignatureAlgorithms,
      } = await getSigningCertificate({ lang, userInteractionTimeout });

      const prepareSigningResponse = await fetch(ui.prepareSigning.url.value, {
        method:  "POST",
        headers: JSON.parse(ui.prepareSigning.headers.value || "{}"),
        body:    JSON.stringify({ certificate, supportedSignatureAlgorithms }),
      });

      await httpErrorHandler(prepareSigningResponse);

      const {
        hash,
        hashFunction,
        signingId,
      } = await prepareSigningResponse.json();

      const {
        signatureAlgorithm,
        signature,
      } = await sign(certificate, hash, hashFunction, { lang, userInteractionTimeout });

      const finalizeSigningResponse = await fetch(ui.finalizeSigning.url.value, {
        method:  "POST",
        headers: JSON.parse(ui.finalizeSigning.headers.value || "{}"),
        body:    JSON.stringify({ signature, signatureAlgorithm, signingId }),
      });

      await httpErrorHandler(finalizeSigningResponse);

      const signResult = await finalizeSigningResponse.json();

      ui.result.value = (
        "Signing successful!" +
        "\n\n[response]\n" +
        JSON.stringify(signResult, null, "  ")
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
