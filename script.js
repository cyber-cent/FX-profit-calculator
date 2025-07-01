const form = document.getElementById('forex-form');
const resultsOutput = document.getElementById('results-output');
const currencyPairSelect = document.getElementById('currency-pair');

form.addEventListener('submit', function(event) {
    event.preventDefault();
    calculate();
});

function calculate() {
    // --- Get form values ---
    const pairOption = currencyPairSelect.options[currencyPairSelect.selectedIndex];
    const pairText = pairOption.text;
    const isJPY = pairText.includes('JPY');
    const pipSize = parseFloat(pairOption.dataset.pip);

    const tradeType = document.querySelector('input[name="trade-type"]:checked').value;
    const lotSize = parseFloat(document.getElementById('lot-size').value);
    const entryPrice = parseFloat(document.getElementById('entry-price').value);
    const exitPrice = parseFloat(document.getElementById('exit-price').value);
    const takeProfitPrice = parseFloat(document.getElementById('take-profit').value);
    const stopLossPrice = parseFloat(document.getElementById('stop-loss').value);

    // --- Basic validation ---
    if (isNaN(lotSize) || isNaN(entryPrice)) {
        resultsOutput.innerHTML = `<p class="loss">Please fill in Lot Size and Entry Price.</p>`;
        return;
    }

    // --- Calculation Logic ---
    const contractSize = lotSize * 100000;
    const pipValueInUSD = contractSize * pipSize; // Simplified for USD quoted pairs

    let resultsHTML = '';

    // Manual Exit Calculation
    if (!isNaN(exitPrice)) {
        resultsHTML += createResultLine('Manual Exit', entryPrice, exitPrice, tradeType, pipSize, pipValueInUSD);
    }

    // Take Profit Calculation
    if (!isNaN(takeProfitPrice)) {
        resultsHTML += createResultLine('Take Profit', entryPrice, takeProfitPrice, tradeType, pipSize, pipValueInUSD);
    }

    // Stop Loss Calculation
    if (!isNaN(stopLossPrice)) {
        resultsHTML += createResultLine('Stop Loss', entryPrice, stopLossPrice, tradeType, pipSize, pipValueInUSD);
    }

    if (resultsHTML === '') {
        resultsOutput.innerHTML = `<p class="info">Please provide at least one exit point (Exit Price, Take Profit, or Stop Loss).</p>`;
    } else {
        resultsOutput.innerHTML = resultsHTML;
    }
}

function createResultLine(scenario, entry, exit, type, pipSize, pipValueInUSD) {
    let pips = 0;
    if (type === 'buy') {
        pips = (exit - entry) / pipSize;
    } else { // sell
        pips = (entry - exit) / pipSize;
    }

    const profitOrLoss = (pips * pipValueInUSD) / 1000;
    const resultClass = profitOrLoss >= 0 ? 'profit' : 'loss';
    const sign = profitOrLoss >= 0 ? '+' : '';

    return `<p class="${resultClass}">
        <strong>${scenario}:</strong> ${sign}${profitOrLoss.toFixed(2)} USD 
        <br>
        <small>(${pips.toFixed(1)} pips)</small>
    </p>`;
}