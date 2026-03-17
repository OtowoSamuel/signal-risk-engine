const fs = require('fs');
let content = fs.readFileSync('__tests__/accuracy.test.ts', 'utf8');

// Vol 75 (1s) 0.01 lot
content = content.replace(
  '// Expected: (0.01 × 1 × 17500) / 1000 = 0.175\n      const expected = (0.01 * symbolData.contractSize * symbolData.typicalPrice) / symbolData.leverage;',
  '// Expected: 0.01 × 1 × 17500 × 0.0005 = 0.0875\n      const expected = 0.01 * 1 * 17500 * 0.0005;'
);
content = content.replace(
  'expect(margin).toBeCloseTo(0.18, 2); // Allow small rounding difference',
  'expect(margin).toBeCloseTo(0.09, 2);'
);

// Vol 75 (1s) 1 full lot
content = content.replace(
  '// Expected: (1.0 × 1 × 17500) / 1000 = 17.50\n      const expected = (1.0 * symbolData.contractSize * symbolData.typicalPrice) / symbolData.leverage;',
  '// Expected: 1.0 × 1 × 17500 × 0.0005 = 8.75\n      const expected = 1.0 * 1 * 17500 * 0.0005;'
);
content = content.replace(
  'expect(margin).toBeCloseTo(17.5, 2);',
  'expect(margin).toBeCloseTo(8.75, 2);'
);

// Vol 75 (1s) Custom entry
content = content.replace(
  '// Expected: (0.01 × 1 × 20000) / 1000 = 0.20\n      expect(margin).toBe(0.2);',
  '// Expected: 0.01 × 1 × 20000 × 0.0005 = 0.10\n      expect(margin).toBe(0.1);'
);

// Step Index
content = content.replace(
  'expect(symbolData.leverage).toBe(500); // Verify lower leverage',
  'expect(symbolData.leverage).toBe(500);'
);
content = content.replace(
  '// Expected: (0.01 × 1 × 20000) / 500 = 0.40\n      const expected = (0.01 * symbolData.contractSize * symbolData.typicalPrice) / symbolData.leverage;',
  '// Expected: 0.01 × 10 × 20000 × 0.0001 = 0.20\n      const expected = 0.01 * 10 * 20000 * 0.0001;'
);
content = content.replace(
  'expect(margin).toBeGreaterThan(0.3); // Should be higher than 1:1000 leverage',
  'expect(margin).toBe(0.2);'
);

// Crash 500
content = content.replace(
  '// Expected: (0.1 × 1 × 1200) / 1000 = 0.12\n      const expected = (0.1 * symbolData.contractSize * symbolData.typicalPrice) / symbolData.leverage;',
  '// Expected: 0.1 × 1 × 1200 × 0.0025 = 0.30\n      const expected = 0.1 * 1 * 1200 * 0.0025;'
);
content = content.replace(
  'expect(margin).toBeCloseTo(0.12, 2);',
  'expect(margin).toBeCloseTo(0.30, 2);'
);

// Boom 500
content = content.replace(
  '// Expected: (0.01 × 1 × 5200000) / 1000 = 52.00\n      const expected = (0.01 * symbolData.contractSize * symbolData.typicalPrice) / symbolData.leverage;',
  '// Expected: 0.01 × 1 × 5200000 × 0.0025 = 130.00\n      const expected = 0.01 * 1 * 5200000 * 0.0025;'
);
content = content.replace(
  'expect(margin).toBeCloseTo(52.0, 2);',
  'expect(margin).toBeCloseTo(130.0, 2);'
);


fs.writeFileSync('__tests__/accuracy.test.ts', content, 'utf8');
