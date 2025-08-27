import { describe, it, expect } from 'vitest';
import express from 'express';
import request from 'supertest';
import { router } from '../routes/verifySignature';
import { Wallet } from 'ethers';

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/', router);
  return app;
}

describe('POST /verify-signature', () => {
  it('verifies a valid personal_sign signature', async () => {
    const app = makeApp();
    const wallet = Wallet.createRandom();
    const message = 'hello world';
    const signature = await wallet.signMessage(message);

    const res = await request(app).post('/verify-signature').send({ message, signature });
    expect(res.status).toBe(200);
    expect(res.body.isValid).toBe(true);
    expect(res.body.signer.toLowerCase()).toBe(wallet.address.toLowerCase());
  });

  it('rejects invalid signature', async () => {
    const app = makeApp();
    const res = await request(app).post('/verify-signature').send({
      message: 'test',
      signature: '0xdeadbeef'
    });
    expect(res.status).toBe(200);
    expect(res.body.isValid).toBe(false);
  });
});
