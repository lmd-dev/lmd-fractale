/**
 * Main view of the application
 */
var View = /** @class */ (function () {
    /**
     * Constructor
     * @param controller Main controller of the application
     */
    function View(controller) {
        this._controller = controller;
        this._controller.addObserver(this);
        this.canvas = $('#drawing-area')[0];
        this.ctx = this.canvas.getContext('2d');
        this.mouseDown = false;
        this.resize();
        this.initializeEvents();
    }
    /**
     * Notification function of the view
     * @param data
     */
    View.prototype.notify = function (data) {
        if (data === void 0) { data = null; }
        if (this._controller.inProgress)
            this.displayWaiting();
        else {
            this.hideWaiting();
            this.displayParameters();
            this.displayFractal();
            if (this.mouseDown && this._controller.mode != 'center')
                this._controller.zoom(this.getZoomLevel());
        }
    };
    /**
     * Initializes main events of the view
     */
    View.prototype.initializeEvents = function () {
        var _this = this;
        $(window).on('resize', function () {
            _this.resize();
        });
        $('#btn-generate').on('click', function () {
            _this.updateParameters();
            _this._controller.generate();
        });
        $('#drawing-area').on('mousedown', function (event) {
            _this.mouseDown = true;
            if (_this._controller.mode !== 'center')
                _this._controller.zoom(_this.getZoomLevel());
        });
        $('#drawing-area').on('mouseup', function (event) {
            if (_this._controller.mode == 'center') {
                var imageWidth = parseFloat(_this._controller.getParameter('ow').value);
                var imageHeight = parseFloat(_this._controller.getParameter('oh').value);
                var x = event.clientX - $('#drawing-area').offset().left - $('#drawing-area').width() / 2;
                var y = -(event.clientY - $('#drawing-area').offset().top - $('#drawing-area').height() / 2);
                _this._controller.centerOn(x, y);
            }
            _this.mouseDown = false;
        });
        $('#btn-center').on('click', function () { _this._controller.mode = 'center'; });
        $('#btn-zoom-in').on('click', function () { _this._controller.mode = 'zoom-in'; });
        $('#btn-zoom-out').on('click', function () { _this._controller.mode = 'zoom-out'; });
    };
    /**
     * Resizes the canvas area
     */
    View.prototype.resize = function () {
        this.canvas.width = $(this.canvas).width();
        this.canvas.height = $(this.canvas).height();
        this.displayFractal();
    };
    /**
     * Sends new paramters value to the controller
     */
    View.prototype.updateParameters = function () {
        var _this = this;
        $('.field-input').each(function (index, item) {
            var input = $(item).find('input');
            if (input.length)
                _this._controller.setParameter(input.attr('name'), input.val());
        });
        $('.field-select').each(function (index, item) {
            var input = $(item).find('select');
            if (input.length)
                _this._controller.setParameter(input.attr('name'), input.val());
        });
        $('.field-checkbox').each(function (index, item) {
            var input = $(item).find('input');
            if (input.length)
                _this._controller.setParameter(input.attr('name'), input.prop('checked') ? "1" : "0");
        });
    };
    /**
     * Displays parameters list
     */
    View.prototype.displayParameters = function () {
        var _this = this;
        var parent = $('#parameters-list');
        parent.html('');
        this._controller.parameters.forEach(function (parameter) {
            _this.displayParameter(parameter, parent);
        });
        $('.btn-mode').removeClass('selected');
        if (this._controller.mode == 'center') {
            $('#btn-center').addClass('selected');
            $('#zoom-field').hide();
        }
        else {
            $('#zoom-field').show();
            if (this._controller.mode == 'zoom-in')
                $('#btn-zoom-in').addClass('selected');
            else if (this._controller.mode == 'zoom-out')
                $('#btn-zoom-out').addClass('selected');
        }
    };
    /**
     * Displays a parameter
     * @param parameter Parameter data to display
     * @param parent Parent of the parameter fields
     */
    View.prototype.displayParameter = function (parameter, parent) {
        switch (parseInt(parameter.inputType.toString())) {
            case InputType.inputText:
                this.displayInputField(parameter, parent, "text");
                break;
            case InputType.inputNumber:
                this.displayInputField(parameter, parent, "number");
                break;
            case InputType.inputMail:
                this.displayInputField(parameter, parent, "mail");
                break;
            case InputType.select:
                this.displaySelectField(parameter, parent);
                break;
            case InputType.checkbox:
                this.displayCheckboxField(parameter, parent);
                break;
        }
    };
    /**
     * Displays an input type parameter
     * @param parameter Parameter to display
     * @param parent Parent of the parameter field
     * @param type Type of input (text, mail, number, ...)
     */
    View.prototype.displayInputField = function (parameter, parent, type) {
        var field = '<div class="field-input">';
        field += '<label>' + parameter.name + '</label>';
        field += '<input type="' + type + '" name="' + parameter.name + '" value="' + parameter.value + '" />';
        field += '</div>';
        parent.append($(field));
    };
    /**
     * Displays a select type parameter
     * @param parameter Parameter to display
     * @param parent Parent of the paramter field
     */
    View.prototype.displaySelectField = function (parameter, parent) {
        var field = '<div class="field-select">';
        field += '<label>' + parameter.name + '</label>';
        field += '<select name="' + parameter.name + '" > ';
        parameter.availables.forEach(function (available) {
            field += '<option value="' + available + '" ' + (parameter.value == available ? 'selected' : '') + '>' + available + '</option>';
        });
        field += '</select>';
        field += '</div>';
        parent.append($(field));
    };
    /**
     * Displays a checkbox type parameter
     * @param parameter Parameter to display
     * @param parent Parent of the paramter field
     */
    View.prototype.displayCheckboxField = function (parameter, parent) {
        var field = '<div class="field-checkbox">';
        field += '<label for="' + parameter.name + '">' + parameter.name + '</label>';
        field += '<input type="checkbox" name="' + parameter.name + '" ' + (parameter.value == "1" ? 'checked' : '') + ' />';
        field += '</div>';
        parent.append($(field));
    };
    /**
     * Displays the picture of the generated fractal stored in /outputs directory
     */
    View.prototype.displayFractal = function () {
        var _this = this;
        var image = new Image();
        var rand = Math.random() * 10000;
        image.onload = function () {
            _this.ctx.drawImage(image, (_this.canvas.width - image.width) / 2, (_this.canvas.height - image.height) / 2);
        };
        image.src = "outputs/" + this._controller.pictureName + "-001.bmp?v=" + rand;
    };
    /**
     * Displays waiting screen while fractal is generated
     */
    View.prototype.displayWaiting = function () {
        $('body').append($('<div id="waiting"><div>In progress...</div></div>'));
    };
    /**
     * Hides the waiting screen
     */
    View.prototype.hideWaiting = function () {
        $('#waiting').remove();
    };
    /**
     * Gets zoom level parameter value
     */
    View.prototype.getZoomLevel = function () {
        return parseFloat($('input[name="zoom"]').val());
    };
    return View;
}());
//# sourceMappingURL=view.js.map