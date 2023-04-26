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
    signButton:        document.getElementById("signButton"),
    signHashType:      document.getElementById("signHashType"),
    signHashHex:       document.getElementById("signHashHex"),
    signLanguage:      document.getElementById("signLanguage"),
    signInfo:          document.getElementById("signInfo"),
    certificateResult: document.getElementById("certificateResult"),
    result:            document.getElementById("signResult"),
  };

  const exampleHashes = {
    "SHA-1":   "c33df55b8aee82b5018130f61a9199f6a9d5d385",
    "SHA-224": "614eadb55ecd6c4938fe23a450edd51292519f7ffb51e91dc8aa5fbe",
    "SHA-256": "413140d54372f9baf481d4c54e2d5c7bcf28fd6087000280e07976121dd54af2",
    "SHA-384": "71839e04e1f8c6e3a6697e27e9a7b8aff24c95358ea7dc7f98476c1e4d88c67d65803d175209689af02aa3cbf69f2fd3",
    "SHA-512": "c793dc32d969cd4982a1d6e630de5aa0ebcd37e3b8bd0095f383a839582b080b9fe2d00098844bd303b8736ca1000344c5128ea38584bbed2d77a3968c7cdd71",
    "SHA-192": "ad41e82bcff23839dc0d9683d46fbae0be3dfcbbb1b49c70",
  };

  ui.signHashHex.value    = exampleHashes[ui.signHashType.value];
  ui.signInfo.value       = "";
  ui.signInfo.placeholder = "Informational message (document name, transaction sum etc)";
  ui.result.value         = "";

  ui.signHashType.addEventListener("change", () => {
    ui.signHashHex.value = exampleHashes[ui.signHashType.value];
  });

  ui.signButton.addEventListener("click", async () => {
    const hash = {
      type: ui.signHashType.value,
      hex:  ui.signHashHex.value,
    };

    const options = {
      ...(ui.signInfo.value ? { info: ui.signInfo.value } : {}),

      lang: ui.signLanguage.value,
    };

    ui.result.value = "";
    ui.signButton.disabled = true;

    try {
      const certificate = JSON.parse(ui.certificateResult.dataset.value);

      const response = await window.hwcrypto.sign(certificate, hash, options);

      ui.result.value = (
        "Signing success!" +
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
