import { useState } from "react";
import * as React from 'react';
import { Button, Popover } from "@mui/material";
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import ru from "date-fns/locale/ru";
import { DateRange  } from 'react-date-range';

type Props = {
    onChangeDate?: (date: {startDate: Date, endDate: Date, key: string}) => void,
    boxStyle? : React.CSSProperties;
    defaultDate?: number
}

export default function DateRangePicker(props: Props) {

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(new Date().getTime() - 86400000*(props.defaultDate || 14)),
            endDate: new Date(),
            key: 'selection',
        },
    ])

    const [dateAnchorEl, setDateAnchorEl] = useState<HTMLButtonElement | null>(null);

    const handleOpenDateList = (event: React.MouseEvent<HTMLButtonElement>) => {
        setDateAnchorEl(event.currentTarget);
    };

    const handleCloseDateList = ()=>{
        setDateAnchorEl(null);
    }

    const handleSelect = (ranges: any) => {
        if(!ranges) return;
        if(!ranges.selection) return;
        setDateRange([ranges.selection]);
        if(props.onChangeDate){
            console.log(ranges.selection)
            if(!ranges.selection) return;
            props.onChangeDate(ranges.selection);
        }
    };
    
    const chooseDateOpen = Boolean(dateAnchorEl);

    return (
        <div style={{width: '22rem', ...props.boxStyle}}>
            <Button
            variant="outlined"
            onClick={handleOpenDateList}
            style={
                {
                    width: '100%',
                    color: chooseDateOpen?'#1975D1':'#3F3E3F',
                    borderColor: chooseDateOpen?'#1975D1':'#B7B5BA',
                    height: '2.5rem'
                }
            }
            >
                {format(dateRange[0].startDate, 'dd.MM.yyyy', {locale: ru})}
                -
                {format(dateRange[0].endDate, 'dd.MM.yyyy', {locale: ru})}
            </Button>
            <Popover
            anchorEl={dateAnchorEl}
            open={chooseDateOpen}
            onClose={handleCloseDateList}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            >
                <div style={
                    {
                        width: '22rem',
                        zIndex: 10,
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px'
                    }
                }>
                    <DateRange
                    editableDateInputs={true}
                    ranges={dateRange}
                    onChange={handleSelect}
                    locale={ru}
                    showDateDisplay={false}
                    />
                </div>
            </Popover>
        </div>
    )
}