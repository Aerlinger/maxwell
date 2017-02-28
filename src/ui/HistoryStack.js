/**
 * Actions:
 *   - Create element
 *   - Update element
 *   - Delete element(s)
 *   - Move element(s)
 *   - Update Circuit
 */
class HistoryStack {
  constructor() {
    this.undoHistory = [];
    this.redoHistory = [];
  }

  pushUndo(circuit) {
    this.undoHistory.push(circuit.copy())
  }

  popUndo() {
    this.undoHistory.pop()
  }

  pushRedo(circuit) {
    this.redoHistory.push(circuit.copy())
  }
}

module.exports = HistoryStack;
