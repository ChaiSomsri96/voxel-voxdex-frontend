


const selectBox = {
    width: "100%",
    height: "35px",
    background: "black",
    color: "white",
    outline: "none",
    border: "none",
}


const CustomSelect = (params: any) => {

    const selectedMint = (val: any) => {
        params.mint(val)
    }

    return (
        <>
            <select name="pools" style={selectBox} onChange={(e) => { selectedMint(e.target.value) }}>
                <option value="select-pool" selected>--- Select---</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
        </>
    );
};

const CustomSelectNew = (params: any) => {

    const selectedMint = (val: any) => {
        params.mint(val)
    }

    return (
        // <Select options={options} />
        <>
            {/* <div style={{ display: "block" }}> */}
            {/* <label >Select Pool</label> */}

            <select name="pools" style={selectBox} onChange={(e) => { selectedMint(e.target.value) }}>
                <option value="select-pool" selected>--- Select---</option>
                <option value="Mint 1">1</option>
                <option value="Mint 2">2</option>
                <option value="Mint 3">3</option>
                <option value="Mint 4">4</option>
            </select>
            {/* </div> */}
        </>
    );
};

export { CustomSelectNew, CustomSelect };