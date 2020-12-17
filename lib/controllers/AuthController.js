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

module.exports = class AuthController {
  constructor() {
    this.path   = "/auth";
    this.router = Router();

    this.router.get(this.path + "/challenge", this.getAuthChallenge);
    this.router.post(this.path + "/token", this.postAuthToken);
  }

  getAuthChallenge(req, res) {
    const nonceLength = req.header("X-Nonce-Length") ? parseInt(req.header("X-Nonce-Length"), 10) : 32;

    // String of random numbers from 0-9 with the string length of nonceLength
    // For example if nonceLength is 5, nonce could be "77391"
    const nonce = (
      Array.from(
        { length: nonceLength },
        () => "" + Math.floor(Math.random() * 10)
      ).join("")
    )

    res.send({ nonce });
  }

  postAuthToken(req, res) {
    const [, encodedPayload] = req.body["auth-token"].split(".");

    const payload = JSON.parse(Buffer.from(encodedPayload, "base64").toString());

    setTimeout(() => res.send(payload), 1000)
  }
};
