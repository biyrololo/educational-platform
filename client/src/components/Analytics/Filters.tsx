import DateRangePicker from "components/DateRangePicker";

type Props ={
    onSelectDate: ({startDate, endDate}: {startDate: Date, endDate: Date}) => void;
}
export default function Filters(props: Props) {


    return (
        <section className="d-flex jc-center ai-center">
            <DateRangePicker
                onChangeDate={props.onSelectDate}
            />
        </section>
    )
}