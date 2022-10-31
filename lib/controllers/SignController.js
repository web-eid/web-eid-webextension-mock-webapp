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

const hashFunctionCommandMap = {
  "SHA-224":  "sha224",
  "SHA-256":  "sha256",
  "SHA-384":  "sha384",
  "SHA-512":  "sha512",
  "SHA3-224": "sha3-224",
  "SHA3-256": "sha3-256",
  "SHA3-384": "sha3-384",
  "SHA3-512": "sha3-512",
}

const defaultHashFunction = "SHA-384";

let signingProcessStore = [];

function prepareDocument(documentId, documentData, certificate, hashFunction) {
  const signingId = Math.random().toString();

  signingProcessStore = [
    ...signingProcessStore,

    {
      signingId,
      documentId,
      documentData,
      certificate,
      hashFunction,
    },
  ];

  return signingId;
}

function finalizeDocument(signingId, signature, signatureAlgorithm) {
  const signingProcess = signingProcessStore.find(({ signingId: id }) => id == signingId);

  console.log("SignController.finalizeDocument:", signingProcess, { signature, signatureAlgorithm });
  console.warn("SignController.finalizeDocument: Signature validation not implemented");

  return true;
}

function getHashForText(text, algorithm) {
  return crypto
    .createHash(algorithm)
    .update(text, "utf-8")
    .digest("base64");
}
/*
function verify(hash, certificate, hashFunction) {
  const verifier = crypto.createVerify()
}
*/
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

    const document               = { id, data: "Hello " + id };
    const hashFunctionFromHeader = req.header("X-Hash-Function");
    const hashFunction           = hashFunctionFromHeader || defaultHashFunction;
    const hashFunctionCommand    = hashFunctionCommandMap[hashFunction];

    const supportedHashFunctions  = supportedSignatureAlgorithms.map((algorithmSet) => algorithmSet.hashFunction);
    const isHashFunctionSupported = supportedHashFunctions.includes(hashFunction);

    if (!isHashFunctionSupported) {
      res.status(400);
      res.send({
        message: (
          `Hash function ${hashFunction} is not supported. ` +
          `Valid hash functions are ${JSON.stringify(supportedHashFunctions)}`
        ),
      });

      return
    }

    const hash = getHashForText(document.data, hashFunctionCommand);

    const signingId = prepareDocument(document.id, document.data, certificate, hashFunction);

    console.log("postPrepareSigning", certificate);

    res.send({
      signingId,
      hash,         // Required
      hashFunction, // Required
    });
  }

  postFinalizeSigning(req, res) {
    const documentId = req.params.id;
    const { signature, signatureAlgorithm, signingId } = req.body;

    const signingProcess = signingProcessStore.find((process) => process.signingId == signingId);

    if (!signingProcess) {
      res.status(400);
      res.send({
        message:   `Signing process with ID ${signingId} not found`,
        activeIds: signingProcessStore.map((item) => item.signingId),
      });

      return;
    }

    if (signingProcess.documentId !== documentId) {
      console.log({ docA: signingProcess.documentId, docB: documentId });

      res.status(400);
      res.send({
        message:         `Signing process ID ${signingId} doesn't match document ID ${documentId}`,
        activeProcesses: signingProcessStore.map(({ signingId, documentId }) => ({ signingId, documentId })),
      });

      return;
    }

    // Validation not implemented
    const isValidSignature = finalizeDocument(signingId, signature, signatureAlgorithm);

    if (!isValidSignature) {
      console.log("Signature invalid");

      res.status(400);
      res.send({ message: "Signature invalid" });

      return;
    }

    res.send({
      signingProcess,
      signature,
    })
  }
};
