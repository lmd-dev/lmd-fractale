class Controller extends Subject
{
    //List of parameters used to generate the fractal
    private _parameters: Array<Parameter>;
    public get parameters(): Array<Parameter> { return this._parameters; };

    //Is the generation in progress ?
    private _inProgress: boolean;
    public get inProgress(): boolean { return this._inProgress; };

    //Selected action mode (center, zoom in, zoom out)
    private _mode: string;
    public get mode(): string { return this._mode; };
    public set mode(value: string) { this._mode = value; this.notify(); };

    //Name of the pictore of the generated fractal
    private _pictureName: string;
    public get pictureName(): string { return this._pictureName; };

    /**
     * Constructor
     */
    constructor()
    {
        super();

        this._parameters = new Array<Parameter>();
        this._inProgress = false;
        this._mode = 'center';
        this._pictureName = '';

        this.loadParameters();
    }

    /**
     * Loads available parameters from the server
     */
    loadParameters()
    {
        $.ajax({
            url: 'parameters',
            method: 'GET',
            dataType: 'json',
            success: (results) =>
            {
                this._parameters = results.parameters.map((item: any) => { return new Parameter(item); });
                this.notify({ parameters: true });
            },
            error: (error) =>
            {

            }
        });
    }

    /**
     * Returns a paramter of the list from its name
     * @param name Name of the parameter to return
     */
    getParameter(name: string): Parameter
    {
        let result = null;

        this._parameters.some((parameter) =>
        {
            if (parameter.name == name)
            {
                result = parameter;
                return true;
            }

            return false;
        });

        return result;
    }

    /**
     * Set the value of the parameter
     * @param name Name of the parameter to update
     * @param value New value of the parameter
     */
    setParameter(name: string, value: string)
    {
        this.parameters.some((parameter: Parameter) =>
        {
            if (parameter.name == name)
            {
                parameter.value = value;
                return true;
            }

            return false;
        });
    }

    /**
     * Asks the server to generate a fractal
     */
    generate()
    {
        if (!this._inProgress)
        {
            this._inProgress = true;
            this.notify();

            $.ajax({
                url: 'generate',
                method: 'POST',
                dataType: 'json',
                data: { parameters: this._parameters.map((item) => { return item.toArray(); }) },
                success: (results) =>
                {
                    this._pictureName = results.pictureName;
                    this._inProgress = false;
                    this.notify();
                },
                error: (error) =>
                {
                    console.error(error);
                    this._inProgress = false;
                    this.notify();
                }
            });
        }
    }

    /**
     * Center the fractal on the given coordinates
     * @param x X coordinates of the fractal area to display
     * @param y Y coordinates of the fractal area to display
     */
    centerOn(x: number, y: number)
    {
        let imageWidth = parseFloat(this.getParameter('ow').value);

        let xCenter = parseFloat(this.getParameter('x').value);
        let yCenter = parseFloat(this.getParameter('y').value);

        let width = parseFloat(this.getParameter('w').value);

        let coef = width / imageWidth;

        this.setParameter('x', (x * coef + xCenter).toString());
        this.setParameter('y', (y * coef + yCenter).toString());

        this.generate();
    }

    /**
     * Sets the zoom level on the fractal area
     * @param level Zoom level to apply
     */
    zoom(level: number)
    {
        let value = parseFloat(this.getParameter('w').value);
        
        if (this.mode == 'zoom-in')
            value *= 1 - level;
        else
            value /= 1 - level;

        this.setParameter('w', value.toString());
        this.generate();
    }
}