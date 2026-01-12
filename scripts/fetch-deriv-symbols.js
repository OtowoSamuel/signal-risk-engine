#!/usr/bin/env node

/**
 * Script to fetch all synthetic indices with EXACT contract specifications from Deriv API
 * Run: node scripts/fetch-deriv-symbols.js
 */

const WebSocket = require('ws');

const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

let synthetics = [];
let detailsFetched = 0;
let symbolDetails = {};

ws.on('open', function open() {
  console.log('Connected to Deriv API...\n');
  console.log('Step 1: Fetching all synthetic indices...\n');
  
  // Request all active symbols with full details
  ws.send(JSON.stringify({
    active_symbols: 'full',
    product_type: 'basic'
  }));
});

ws.on('message', function message(data) {
  const response = JSON.parse(data);
  
  if (response.active_symbols) {
    synthetics = response.active_symbols.filter(s => s.market === 'synthetic_index');
    
    console.log(`Found ${synthetics.length} synthetic indices\n`);
    console.log('Step 2: Fetching detailed contract specifications...\n');
    
    // Fetch trading_times for each symbol to get more details
    synthetics.forEach(s => {
      symbolDetails[s.symbol] = {
        display_name: s.display_name,
        symbol: s.symbol,
        submarket: s.submarket_display_name,
        pip: s.pip,
        market_open: s.exchange_is_open,
        min_contract_size: null,
        max_contract_size: null,
        contract_size_increment: null
      };
      
      // Request contracts_for to get lot size info
      ws.send(JSON.stringify({
        contracts_for: s.symbol,
        currency: 'USD',
        product_type: 'basic'
      }));
    });
  }
  
  if (response.contracts_for) {
    const symbol = response.contracts_for.available[0]?.underlying_symbol;
    
    if (symbol && symbolDetails[symbol]) {
      // Extract contract specifications
      const contract = response.contracts_for.available[0];
      
      symbolDetails[symbol].min_contract_size = contract.min_contract_stake || 'N/A';
      symbolDetails[symbol].max_contract_size = contract.max_contract_stake || 'N/A';
      
      detailsFetched++;
      
      // When all details are fetched, display results
      if (detailsFetched === synthetics.length) {
        displayResults();
      }
    }
  }
  
  if (response.error) {
    console.error('API Error:', response.error.message);
  }
});

function displayResults() {
  console.log('\n=== COMPLETE SYNTHETIC INDICES WITH CONTRACT SPECIFICATIONS ===\n');
  
  // Group by submarket
  const grouped = {};
  Object.values(symbolDetails).forEach(s => {
    const submarket = s.submarket || 'Other';
    if (!grouped[submarket]) {
      grouped[submarket] = [];
    }
    grouped[submarket].push(s);
  });
  
  // Display organized
  Object.keys(grouped).sort().forEach(submarket => {
    console.log(`\n## ${submarket} (${grouped[submarket].length} symbols)`);
    console.log('─'.repeat(120));
    console.log('Display Name'.padEnd(40) + 'Symbol'.padEnd(20) + 'Min Lot'.padEnd(15) + 'Max Lot'.padEnd(15) + 'Pip');
    console.log('─'.repeat(120));
    
    grouped[submarket].forEach(s => {
      console.log(
        s.display_name.padEnd(40) +
        s.symbol.padEnd(20) +
        String(s.min_contract_size).padEnd(15) +
        String(s.max_contract_size).padEnd(15) +
        s.pip
      );
    });
  });
  
  console.log(`\n\nTOTAL SYNTHETIC INDICES: ${synthetics.length}`);
  
  // Generate TypeScript mapping
  console.log('\n\n=== MINIMUM LOT SIZES FOR symbols.ts ===\n');
  Object.values(symbolDetails).sort((a, b) => a.display_name.localeCompare(b.display_name)).forEach(s => {
    if (s.min_contract_size !== 'N/A') {
      console.log(`'${s.display_name}': minLot: ${s.min_contract_size},`);
    }
  });
  
  ws.close();
}

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
  process.exit(1);
});
