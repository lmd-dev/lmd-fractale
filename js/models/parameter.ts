class Parameter
{
    //Name of the parameter
    private _name: string;
    public get name(): string { return this._name; };
    public set name(value: string) { this._name = value; };

    //Type of input needed for the parameter
    private _inputType: InputType;
    public get inputType(): InputType { return this._inputType; };
    public set inputType(value: InputType) { this._inputType = value; };

    //Value of the parameter
    private _value: string;
    public get value(): string { return this._value; };
    public set value(value: string) { this._value = value; };

    //Available options for select type parameters
    private _availables: Array<string>;
    public get availables(): Array<string> { return this._availables; };

    /**
     * Constructor
     * @param data default data
     */
    constructor(data: any = null)
    {
        this._name = "";
        this._inputType = InputType.inputText;
        this._value = "";
        this._availables = new Array<string>();

        this.fromArray(data);
    }

    /**
     * Imports data from JS object
     * @param data Data to import
     */
    fromArray(data: any)
    {
        if (data)
        {
            this._name = (data.name !== undefined ? data.name : this._name);
            this._inputType = (data.inputType !== undefined ? data.inputType : this._inputType);
            this._value = (data.value !== undefined ? data.value : this._value);
            this._availables = (data.availables !== undefined ? data.availables : this._availables);
        }
    }

    /**
     * Exports data to JS object
     */
    toArray(): any
    {
        return {
            name: this._name,
            inputType: this._inputType,
            value: this._value.toLowerCase(),
            availables: this._availables
        }
    }
}