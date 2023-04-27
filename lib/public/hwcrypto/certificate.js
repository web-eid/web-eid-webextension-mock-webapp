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
    getCertificateButton: document.getElementById("getCertificateButton"),
    filter:               document.getElementById("certificateFilter"),
    language:             document.getElementById("certificateLanguage"),
    result:               document.getElementById("certificateResult"),
  };

  delete ui.result.dataset.value;
  ui.result.value = "";

  ui.getCertificateButton.addEventListener("click", async () => {

    const filter = ui.filter.value;

    const options = {
      ...(filter ? { filter } : {}),
      lang: ui.language.value,
    };

    delete ui.result.dataset.value;
    ui.result.value = "";
    ui.getCertificateButton.disabled = true;

    try {
      const response = await window.hwcrypto.getCertificate(options);

      ui.result.value = (
        "Get certificate success!" +
        "\n\n[response]\n" +
        JSON.stringify(response, null, "  ")
      );

      ui.result.dataset.value = JSON.stringify(response);

    } catch (error) {
      ui.result.value = (
        "Get certificate failed!" +
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
      ui.getCertificateButton.disabled = false;
    }

  });
}

document.addEventListener("DOMContentLoaded", init);
