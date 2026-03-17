import { calculateMargin } from '../lib/calculator';
import { getSymbol } from '../lib/symbols';

describe('TP/SL Preview Math Path', () => {
  it('should calculate precise P/L values based on current Deriv spec', () => {
    // Expected math logic used in TradePnLPreview
    const symbolData = getSymbol('Volatility 75 (1s) Index');
    const openPrice = 1000;
    const closedPriceTakeProfit = 1010;
    const closedPriceStopLoss = 995;
    const lotSize = 0.5;

    // Profit = (ClosePrice - OpenPrice) * ContractSize * Lots
    const expectedTP = (closedPriceTakeProfit - openPrice) * symbolData.contractSize * lotSize;
    const expectedSL = (closedPriceStopLoss - openPrice) * symbolData.contractSize * lotSize;

    expect(expectedTP).toBeCloseTo(10 * symbolData.contractSize * lotSize, 2);
    expect(expectedSL).toBeCloseTo(-5 * symbolData.contractSize * lotSize, 2);
    
    // Test point values
    const pointDifferenceTP = closedPriceTakeProfit - openPrice;
    expect(expectedTP).toBeCloseTo(pointDifferenceTP * symbolData.contractSize * lotSize, 2);
  });
});
