var AppFractal = /** @class */ (function () {
    /**
     * Constructor
     */
    function AppFractal() {
        this._controller = new Controller();
        this._view = new View(this._controller);
    }
    return AppFractal;
}());
//Entry point of the application
$(window).ready(function () { var app = new AppFractal(); });
//# sourceMappingURL=app-fractal.js.map