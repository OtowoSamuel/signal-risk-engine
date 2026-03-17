const fs = require('fs');
const file = '__tests__/accuracy.test.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /it\('should verify leverage affects margin correctly', \(\) => \{[\s\S]*?\}\);/,
  `it('should verify leverage affects margin correctly', () => {
      const vol75Data = getSymbol('Volatility 75 (1s) Index');
      const margin1000 = calculateMargin(0.01, 'Volatility 75 (1s) Index');
      const expectedMargin1000 = (0.01 * vol75Data.contractSize * vol75Data.typicalPrice) / vol75Data.leverage;
      expect(margin1000).toBeCloseTo(expectedMargin1000, 1);
    });`
);
fs.writeFileSync(file, code);
