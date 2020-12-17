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

const { Router } = require("express");
const crypto = require("crypto");

const algorithmCommandMap = {
  "SHA-224":  "sha224",
  "SHA-256":  "sha256",
  "SHA-384":  "sha384",
  "SHA-512":  "sha512",
  "SHA3-224": "sha3-224",
  "SHA3-256": "sha3-256",
  "SHA3-384": "sha3-384",
  "SHA3-512": "sha3-512",
}

const defaultAlgorithm = "SHA-384";

function getHashForText(text, algorithm) {
  return crypto
    .createHash(algorithm)
    .update(text, "utf-8")
    .digest("base64");
}

module.exports = class SignController {
  constructor() {
    this.path   = "/document/:id/sign";
    this.router = Router();

    this.router.post(this.path + "/prepare", this.postPrepareSigning);
    this.router.post(this.path + "/finalize", this.postFinalizeSigning);
  }

  postPrepareSigning(req, res) {
    const { id } = req.params;

    const { certificate, supportedSignatureAlgorithms } = req.body;

    const algorithmFromHeader = req.header("X-Algorithm");
    const algorithmName       = algorithmFromHeader || defaultAlgorithm;
    const algorithmCommand    = algorithmCommandMap[algorithmName];

    const supportedHashAlgorithms  = supportedSignatureAlgorithms.map((algorithmSet) => algorithmSet.hash);
    const isHashAlgorithmSupported = supportedHashAlgorithms.includes(algorithmName);

    if (!isHashAlgorithmSupported) {
      res.status(400);
      res.send({
        message: (
          `Hash algorithm ${algorithmName} is not supported. ` +
          `Valid algorithms are ${JSON.stringify(supportedHashAlgorithms)}`
        ),
      });

      return
    }

    const hash = getHashForText("Hello " + id, algorithmCommand);

    console.log("postPrepareSigning", certificate);

    setTimeout(() => {
      res.send({
        hash,                      // Required
        algorithm:  algorithmName, // Required
        documentId: id,            // Arbitrary custom data for finalize request
      });
    }, 2000);

  }

  postFinalizeSigning(req, res) {
    const { id } = req.params;
    const { signature, hash, algorithm, documentId } = req.body;

    const algorithmName    = algorithm || defaultAlgorithm;
    const algorithmCommand = algorithmCommandMap[algorithmName]

    const rehash = getHashForText("Hello " + id, algorithmCommand);

    if (hash !== rehash) {
      console.log("Prepared document hash doesn't match", { hash, rehash });

      res.status(400);
      res.send({ message: "Prepared document hash doesn't match" });

      return;
    }

    console.log("postFinalizeSigning", { id, documentId, signature, hash, algorithm })

    setTimeout(() => res.send({ documentId }), 1000)
  }
};
