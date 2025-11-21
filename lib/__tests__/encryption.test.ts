/**
 * Unit tests for encryption utilities
 */

import { symmetricDecrypt, symmetricEncrypt } from '@/lib/encryption';

describe('Encryption Utilities', () => {
    const originalEnv = process.env.ENCRYPTION_KEY;

    beforeAll(() => {
        // AES-256 requires a 32-byte key (64 hex characters)
        process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    });

    afterAll(() => {
        process.env.ENCRYPTION_KEY = originalEnv;
    });

    describe('symmetricEncrypt', () => {
        it('should encrypt a string successfully', () => {
            const plaintext = 'sensitive data';
            const encrypted = symmetricEncrypt(plaintext);

            expect(encrypted).toBeDefined();
            expect(encrypted).not.toBe(plaintext);
            expect(encrypted.length).toBeGreaterThan(0);
        });

        it('should produce different encrypted values for same input', () => {
            const plaintext = 'test data';
            const encrypted1 = symmetricEncrypt(plaintext);
            const encrypted2 = symmetricEncrypt(plaintext);

            expect(encrypted1).not.toBe(encrypted2);
        });
    });

    describe('symmetricDecrypt', () => {
        it('should decrypt encrypted data correctly', () => {
            const plaintext = 'secret message';
            const encrypted = symmetricEncrypt(plaintext);
            const decrypted = symmetricDecrypt(encrypted);

            expect(decrypted).toBe(plaintext);
        });

        it('should handle empty strings', () => {
            const encrypted = symmetricEncrypt('');
            const decrypted = symmetricDecrypt(encrypted);

            expect(decrypted).toBe('');
        });

        it('should handle special characters', () => {
            const plaintext = 'Test!@#$%^&*()_+{}:"<>?[];,./';
            const encrypted = symmetricEncrypt(plaintext);
            const decrypted = symmetricDecrypt(encrypted);

            expect(decrypted).toBe(plaintext);
        });

        it('should handle unicode characters', () => {
            const plaintext = '你好世界 🚀 مرحبا';
            const encrypted = symmetricEncrypt(plaintext);
            const decrypted = symmetricDecrypt(encrypted);

            expect(decrypted).toBe(plaintext);
        });
    });

    describe('roundtrip encryption/decryption', () => {
        it('should handle multiple encrypt/decrypt cycles', () => {
            let data = 'original data';

            for (let i = 0; i < 5; i++) {
                const encrypted = symmetricEncrypt(data);
                data = symmetricDecrypt(encrypted);
            }

            expect(data).toBe('original data');
        });
    });
});
