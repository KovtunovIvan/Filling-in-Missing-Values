function SelectOption(props) {
    const {label, name, id, list, disabled} = props;
    const optionsList = list.map((item) => {
        return (
            <option 
                className="select-option__select__option"
                value={item.name}
                key={item.id}
            >
                {item.name}
            </option>
        )
    })
    return (
        <div className="select-option-wrapper">
            <label for={id} className="select-option__label">
                {label}
            </label>
            <div className="select-option__select-wrapper">
            {
                disabled ? (
                    <select className="select-option__select"name={name} id={id} disabled>
                        {optionsList}
                    </select>
                )
                : (
                    <select className="select-option__select"name={name} id={id}>
                        {optionsList}
                    </select>                )
            }
            </div>

        </div>
    )
}


export {SelectOption}