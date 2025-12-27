const InputField = ({
    label,
    id,
    type,
    errors,
    register,
    required,
    message,
    className,
    min, 
    max,
    value,
    placeHolder
}) => {
    // Build validation rules
    const getValidationRules = () => {
        const rules = {
            required: { value: required, message }
        };

        if (type === "number") {
            // For number type, use min/max value validation
            if (min !== undefined) {
                rules.min = { value: min, message: `Giá trị tối thiểu là ${min}` };
            }
            if (max !== undefined) {
                rules.max = { value: max, message: `Giá trị tối đa là ${max}` };
            }
            rules.valueAsNumber = true;
        } else {
            // For text type, use minLength
            if (min) {
                rules.minLength = { value: min, message: `Tối thiểu ${min} ký tự` };
            }
        }

        if (type === "email") {
            rules.pattern = { 
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                message: "Email không hợp lệ" 
            };
        }

        if (type === "url") {
            rules.pattern = { 
                value: /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(:\d+)?(\/[^\s]*)?$/i, 
                message: "URL không hợp lệ" 
            };
        }

        return rules;
    };

    return (
        <div className="flex flex-col gap-1 w-full ">
            <label htmlFor={id}
                className={`${className ? className : ""} font-semibold text-sm text-slate-800`}>
                    {label} {required && <span className="text-red-500">*</span>}
            </label>
            
            <input 
                type={type} 
                id={id}
                placeholder={placeHolder}
                min={type === "number" ? min : undefined}
                max={type === "number" ? max : undefined}
                className={`${className ? className : ""} px-2 py-2 border outline-none bg-transparent text-slate-800 rounded-md ${errors[id]?.message ? "border-red-500" : "border-slate-700"}`} 
                {...register(id, getValidationRules())}
            />
            {errors[id]?.message && (
                <p className="text-sm font-semibold text-red-600 mt-0">
                    {errors[id]?.message}
                </p>
            )}
        </div>
    )
};

export default InputField;