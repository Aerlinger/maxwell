VarRailElm.prototype = new RailElm();
VarRailElm.prototype.constructor = VarRailElm;


// Add the following UI elements
VarRailElm.prototype.slider;
VarRailElm.prototype.label;
VarRailElm.prototype.sliderText;

function VarRailElm(xa, ya, xb, yb, f, st) {
    RailElm.call(this, xa, ya, xb, yb, f, st)

    this.sliderText = "voltage";
    this.frequency = this.maxVoltage;
    this.createSlider();
}
;

VarRailElm.prototype.dump = function () {
    return RailElm.prototype.dump.call(this) + " " + this.sliderText;
};

VarRailElm.prototype.getDumpType = function () {
    return 172;
};

VarRailElm.prototype.createSlider = function () {
    // Todo: implement
};

VarRailElm.getVoltage = function () {
    frequency = slider.getValue() * (maxVoltage - bias) / 100. + bias;
    return frequency;
};

VarRailElm.prototype.delete = function () {
    Circuit.main.remove(label);
    Circuit.main.remove(slider);
};

VarRailElm.prototype.getEditInfo = function (n) {
    if (n == 0)
        return new EditInfo("Min Voltage", bias, -20, 20);
    if (n == 1)
        return new EditInfo("Max Voltage", maxVoltage, -20, 20);
    if (n == 2) {
        var ei = new EditInfo("Slider Text", 0, -1, -1);
        ei.text = sliderText;
        return ei;
    }
    return null;
};

VarRailElm.prototype.setEditValue = function (n, ei) {
    if (n == 0)
        bias = ei.value;
    if (n == 1)
        maxVoltage = ei.value;
    if (n == 2) {
        sliderText = ei.textf.getText();
        label.setText(sliderText);
    }
};