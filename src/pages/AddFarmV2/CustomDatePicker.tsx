
const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

const dateInput = {
    filter: "invert(1)",
    border: "none",
    width: "100%",
    padding: "10px",
    outline: "none",
    fontWeight: "bold"
}


const CustomDatePicker = (params: any) => {
    const selectedDateTimePicker = (val: any) => {
        params.dateTime(val)
    }
    return (
        <>
            <input
                value={params?.value}
                type="datetime-local"
                min={params?.min}
                max={params?.max}
                id="birthdaytime"
                name="birthdaytime"
                style={dateInput}
                onChange={(e) => { selectedDateTimePicker(e.target.value) }}
                disabled={params?.disabled}
            />
        </>
    );
};

export default CustomDatePicker;