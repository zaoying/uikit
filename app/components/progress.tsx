import { FC } from "react";

export interface ProgressProps {
    percentage: number
}

export const Progress: FC<ProgressProps> = (props) => {
    const width = props.percentage < 0 ? 0 : (props.percentage > 100 ? 100 : props.percentage)
    const style = {width: width + "%"}
    return <div className="progress">
        <span className="percentage" style={style}>{props.percentage}%</span>
    </div>
}