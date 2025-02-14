import React, { useState } from 'react';
import Alert from "react-bootstrap/Alert";

const RadioButtonGroup = ({ name, answerIndex, value, recordIndex, onChange, groupName, active }) => {
    const [selectedValue, setSelectedValue] = useState(value);

    const options = [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
    ];

    const handleChange = (event) => {
        const selectedValue = event.target.value;
        console.log(recordIndex, answerIndex, selectedValue)
        setSelectedValue(selectedValue); // Update the selectedValue state
        onChange(recordIndex, answerIndex, selectedValue);
    };

    return (
        <div className="d-flex col-lg-3 col-3">
            {groupName}:
            {options.map((option, index) => (
                <div key={index}>
                    <Alert variant="info" className="py-0 px-2 " >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedValue === option.value}
                            disabled={!active}
                            onChange={handleChange}
                        />
                        <label>{option.label}</label>
                    </Alert>
                </div>
            ))}
        </div>
    );
};

export default RadioButtonGroup;