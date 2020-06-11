var Parameter = /** @class */ (function () {
    /**
     * Constructor
     * @param data default data
     */
    function Parameter(data) {
        if (data === void 0) { data = null; }
        this._name = "";
        this._inputType = InputType.inputText;
        this._value = "";
        this._availables = new Array();
        this.fromArray(data);
    }
    Object.defineProperty(Parameter.prototype, "name", {
        get: function () { return this._name; },
        set: function (value) { this._name = value; },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(Parameter.prototype, "inputType", {
        get: function () { return this._inputType; },
        set: function (value) { this._inputType = value; },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(Parameter.prototype, "value", {
        get: function () { return this._value; },
        set: function (value) { this._value = value; },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    Object.defineProperty(Parameter.prototype, "availables", {
        get: function () { return this._availables; },
        enumerable: true,
        configurable: true
    });
    ;
    /**
     * Imports data from JS object
     * @param data Data to import
     */
    Parameter.prototype.fromArray = function (data) {
        if (data) {
            this._name = (data.name !== undefined ? data.name : this._name);
            this._inputType = (data.inputType !== undefined ? data.inputType : this._inputType);
            this._value = (data.value !== undefined ? data.value : this._value);
            this._availables = (data.availables !== undefined ? data.availables : this._availables);
        }
    };
    /**
     * Exports data to JS object
     */
    Parameter.prototype.toArray = function () {
        return {
            name: this._name,
            inputType: this._inputType,
            value: this._value.toLowerCase(),
            availables: this._availables
        };
    };
    return Parameter;
}());
//# sourceMappingURL=parameter.js.map