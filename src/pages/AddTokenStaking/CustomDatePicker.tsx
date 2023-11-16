
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

    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1);
    const day = date.getDate();
    const hour = date.getHours();
    const min = date.getMinutes();
    const formattedDate = String(year + "-" + (month < 10 ? ("0" + month) : month) + "-" + (day < 10 ? ("0" + day) : day) + "T" + (hour < 10 ? ("0" + hour) : hour) + ":" + (min < 10 ? ("0" + min) : min));

    const selectedDateTimePicker = (val: any) => {
        params.dateTime(val)
    }

    return (
        <>
            <input
                value={params?.value}
                type="datetime-local"
                id="birthdaytime"
                name="birthdaytime"
                min={formattedDate}
                style={dateInput}
                onChange={(e) => { selectedDateTimePicker(e.target.value) }}
                disabled={params?.disabled}
            />
        </>
    );
};

export default CustomDatePicker;