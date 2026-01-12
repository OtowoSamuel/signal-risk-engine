#!/usr/bin/env node

/**
 * Get REAL minimum lot sizes from Deriv MT5 API
 */

const WebSocket = require('ws');

const ws = new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1089');

ws.on('open', function open() {
  console.log('Querying Deriv API for trading specifications...\n');
  
  // Try getting asset_index which has detailed specifications
  ws.send(JSON.stringify({
    asset_index: 1
  }));
});

ws.on('message', function message(data) {
  const response = JSON.parse(data);
  
  if (response.asset_index) {
    console.log('=== ASSET INDEX DATA (Synthetic Indices) ===\n');
    
    const synthetics = response.asset_index.filter(a => 
      a[0].includes('Volatility') || 
      a[0].includes('Crash') || 
      a[0].includes('Boom') ||
      a[0].includes('Jump') ||
      a[0].includes('Range') ||
      a[0].includes('Step')
    );
    
    console.log('Found', synthetics.length, 'entries\n');
    
    synthetics.forEach(asset => {
      console.log(`${asset[0]}: ${JSON.stringify(asset[1])}`);
    });
    
    ws.close();
  }
  
  if (response.error) {
    console.error('Error:', response.error.message);
    
    // Try trading_platform_asset_listing instead
    console.log('\nTrying MT5 asset listing...\n');
    ws.send(JSON.stringify({
      trading_platform_asset_listing: 1,
      platform: 'mt5'
    }));
  }
  
  if (response.trading_platform_asset_listing) {
    console.log('=== MT5 ASSET LISTING ===\n');
    console.log(JSON.stringify(response.trading_platform_asset_listing, null, 2));
    ws.close();
  }
});

ws.on('error', function error(err) {
  console.error('WebSocket error:', err);
  process.exit(1);
});
