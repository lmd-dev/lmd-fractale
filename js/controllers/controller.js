var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Controller = /** @class */ (function (_super) {
    __extends(Controller, _super);
    /**
     * Constructor
     */
    function Controller() {
        var _this = _super.call(this) || this;
        _this._parameters = new Array();
        _this._inProgress = false;
        _this._mode = 'center';
        _this._pictureName = '';
        _this.loadParameters();
        return _this;
    }
    Object.defineProperty(Controller.prototype, "parameters", {
        get: function () { return this._parameters; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Controller.prototype, "inProgress", {
        get: function () { return this._inProgress; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Controller.prototype, "mode", {
        get: function () { return this._mode; },
        set: function (value) { this._mode = value; this.notify(); },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(Controller.prototype, "pictureName", {
        get: function () { return this._pictureName; },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * Loads available parameters from the server
     */
    Controller.prototype.loadParameters = function () {
        var _this = this;
        $.ajax({
            url: 'parameters',
            method: 'GET',
            dataType: 'json',
            success: function (results) {
                _this._parameters = results.parameters.map(function (item) { return new Parameter(item); });
                _this.notify({ parameters: true });
            },
            error: function (error) {
            }
        });
    };
    /**
     * Returns a paramter of the list from its name
     * @param name Name of the parameter to return
     */
    Controller.prototype.getParameter = function (name) {
        var result = null;
        this._parameters.some(function (parameter) {
            if (parameter.name == name) {
                result = parameter;
                return true;
            }
            return false;
        });
        return result;
    };
    /**
     * Set the value of the parameter
     * @param name Name of the parameter to update
     * @param value New value of the parameter
     */
    Controller.prototype.setParameter = function (name, value) {
        this.parameters.some(function (parameter) {
            if (parameter.name == name) {
                parameter.value = value;
                return true;
            }
            return false;
        });
    };
    /**
     * Asks the server to generate a fractal
     */
    Controller.prototype.generate = function () {
        var _this = this;
        if (!this._inProgress) {
            this._inProgress = true;
            this.notify();
            $.ajax({
                url: 'generate',
                method: 'POST',
                dataType: 'json',
                data: { parameters: this._parameters.map(function (item) { return item.toArray(); }) },
                success: function (results) {
                    _this._pictureName = results.pictureName;
                    _this._inProgress = false;
                    _this.notify();
                },
                error: function (error) {
                    console.error(error);
                    _this._inProgress = false;
                    _this.notify();
                }
            });
        }
    };
    /**
     * Center the fractal on the given coordinates
     * @param x X coordinates of the fractal area to display
     * @param y Y coordinates of the fractal area to display
     */
    Controller.prototype.centerOn = function (x, y) {
        var imageWidth = parseFloat(this.getParameter('ow').value);
        var xCenter = parseFloat(this.getParameter('x').value);
        var yCenter = parseFloat(this.getParameter('y').value);
        var width = parseFloat(this.getParameter('w').value);
        var coef = width / imageWidth;
        this.setParameter('x', (x * coef + xCenter).toString());
        this.setParameter('y', (y * coef + yCenter).toString());
        this.generate();
    };
    /**
     * Sets the zoom level on the fractal area
     * @param level Zoom level to apply
     */
    Controller.prototype.zoom = function (level) {
        var value = parseFloat(this.getParameter('w').value);
        if (this.mode == 'zoom-in')
            value *= 1 - level;
        else
            value /= 1 - level;
        this.setParameter('w', value.toString());
        this.generate();
    };
    return Controller;
}(Subject));
//# sourceMappingURL=controller.js.map