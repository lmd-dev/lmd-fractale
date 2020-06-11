/**
 * Main view of the application
 */
class View implements Observer
{
    //Controller responsible for the view
    private _controller: Controller;

    //Canvas used to display fractal
    private canvas: HTMLCanvasElement;

    //Canvas 2D context
    private ctx: CanvasRenderingContext2D;

    //Is the mouse button down
    private mouseDown: boolean;

    /**
     * Constructor
     * @param controller Main controller of the application
     */
    constructor(controller: Controller)
    {
        this._controller = controller;
        this._controller.addObserver(this);

        this.canvas = <HTMLCanvasElement>$('#drawing-area')[0];
        this.ctx = this.canvas.getContext('2d');

        this.mouseDown = false;

        this.resize();

        this.initializeEvents();
    }

    /**
     * Notification function of the view
     * @param data
     */
    notify(data = null)
    {
        if (this._controller.inProgress)
            this.displayWaiting();
        else
        {
            this.hideWaiting();

            this.displayParameters();

            this.displayFractal();

            if (this.mouseDown && this._controller.mode != 'center')
                this._controller.zoom(this.getZoomLevel());
        }
    }

    /**
     * Initializes main events of the view
     */
    initializeEvents()
    {
        $(window).on('resize', () =>
        {
            this.resize();
        });

        $('#btn-generate').on('click', () =>
        {
            this.updateParameters();
            this._controller.generate();
        });

        $('#drawing-area').on('mousedown', (event) =>
        {
            this.mouseDown = true;

            if (this._controller.mode !== 'center')
                this._controller.zoom(this.getZoomLevel());
        });

        $('#drawing-area').on('mouseup', (event) =>
        {
            if (this._controller.mode == 'center')
            {
                let imageWidth = parseFloat(this._controller.getParameter('ow').value);
                let imageHeight = parseFloat(this._controller.getParameter('oh').value);

                let x = event.clientX - $('#drawing-area').offset().left - $('#drawing-area').width() / 2;
                let y = -(event.clientY - $('#drawing-area').offset().top - $('#drawing-area').height() / 2);

                this._controller.centerOn(x, y);
            }

            this.mouseDown = false;
        });

        $('#btn-center').on('click', () => { this._controller.mode = 'center'; })
        $('#btn-zoom-in').on('click', () => { this._controller.mode = 'zoom-in'; })
        $('#btn-zoom-out').on('click', () => { this._controller.mode = 'zoom-out'; })
    }

    /**
     * Resizes the canvas area
     */
    resize()
    {
        this.canvas.width = $(this.canvas).width();
        this.canvas.height = $(this.canvas).height();

        this.displayFractal();
    }

    /**
     * Sends new paramters value to the controller
     */
    updateParameters(): any
    {
        $('.field-input').each((index: number, item: HTMLElement) =>
        {
            let input = $(item).find('input');
            if (input.length)
                this._controller.setParameter(input.attr('name'), input.val());
        });

        $('.field-select').each((index: number, item: HTMLElement) =>
        {
            let input = $(item).find('select');
            if (input.length)
                this._controller.setParameter(input.attr('name'), input.val());
        });

        $('.field-checkbox').each((index: number, item: HTMLElement) =>
        {
            let input = $(item).find('input');
            if (input.length)
                this._controller.setParameter(input.attr('name'), input.prop('checked') ? "1" : "0");
        });
    }

    /**
     * Displays parameters list
     */
    displayParameters()
    {
        let parent = $('#parameters-list');
        parent.html('');

        this._controller.parameters.forEach((parameter: Parameter) =>
        {
            this.displayParameter(parameter, parent);
        });

        $('.btn-mode').removeClass('selected');

        if (this._controller.mode == 'center')
        {
            $('#btn-center').addClass('selected');
            $('#zoom-field').hide();
        }
        else
        {
            $('#zoom-field').show();
            if (this._controller.mode == 'zoom-in')
                $('#btn-zoom-in').addClass('selected');
            else if (this._controller.mode == 'zoom-out')
                $('#btn-zoom-out').addClass('selected');
        }
    }

    /**
     * Displays a parameter
     * @param parameter Parameter data to display
     * @param parent Parent of the parameter fields
     */
    displayParameter(parameter: Parameter, parent: JQuery)
    {
        switch (parseInt(parameter.inputType.toString()))
        {
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
    }

    /**
     * Displays an input type parameter
     * @param parameter Parameter to display
     * @param parent Parent of the parameter field
     * @param type Type of input (text, mail, number, ...)
     */
    displayInputField(parameter: Parameter, parent: JQuery, type: string)
    {
        let field = '<div class="field-input">';
        field += '<label>' + parameter.name + '</label>';
        field += '<input type="' + type + '" name="' + parameter.name + '" value="' + parameter.value + '" />'
        field += '</div>';

        parent.append($(field));
    }

    /**
     * Displays a select type parameter
     * @param parameter Parameter to display
     * @param parent Parent of the paramter field
     */
    displaySelectField(parameter: Parameter, parent: JQuery)
    {
        let field = '<div class="field-select">';
        field += '<label>' + parameter.name + '</label>';
        field += '<select name="' + parameter.name + '" > ';

        parameter.availables.forEach((available: string) =>
        {
            field += '<option value="' + available + '" ' + (parameter.value == available ? 'selected' : '') + '>' + available + '</option>';
        });

        field += '</select>';
        field += '</div>';

        parent.append($(field));
    }

    /**
     * Displays a checkbox type parameter
     * @param parameter Parameter to display
     * @param parent Parent of the paramter field
     */
    displayCheckboxField(parameter: Parameter, parent: JQuery)
    {
        let field = '<div class="field-checkbox">';
        field += '<label for="' + parameter.name + '">' + parameter.name + '</label>';
        field += '<input type="checkbox" name="' + parameter.name + '" ' + (parameter.value == "1" ? 'checked' : '') + ' />'
        field += '</div>';

        parent.append($(field));
    }

    /**
     * Displays the picture of the generated fractal stored in /outputs directory
     */
    displayFractal()
    {
        let image = new Image();
        let rand = Math.random() * 10000;
        image.onload = () =>
        {
            this.ctx.drawImage(image, (this.canvas.width - image.width) / 2, (this.canvas.height - image.height) / 2);
        }
        image.src = "outputs/" + this._controller.pictureName + "-001.bmp?v=" + rand;
    }

    /**
     * Displays waiting screen while fractal is generated
     */
    displayWaiting()
    {
        $('body').append($('<div id="waiting"><div>In progress...</div></div>'));
    }

    /**
     * Hides the waiting screen
     */
    hideWaiting()
    {
        $('#waiting').remove();
    }

    /**
     * Gets zoom level parameter value
     */
    getZoomLevel(): number
    {
        return parseFloat($('input[name="zoom"]').val());
    }
}