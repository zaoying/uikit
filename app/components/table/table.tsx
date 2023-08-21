import { FC, ReactNode, useEffect, useState } from 'react';
import { Context, NewIoCContext, useIoC } from "../../hooks/ioc";
import { PropsDispatcher, UniqueController } from '../container';

const {define} = NewIoCContext()

export type TableColumnProps = {
    name: string
    title: ReactNode
    width?: number
    children: FC<{ctx: Context, name: string, rowNum: number, data: any}>
}

export const TableColumn: FC<TableColumnProps> = define((props) => {
    const context = useIoC()
    const setProps = context.inject(TablePropsDispatcher)
    const ctl = NewTableController(setProps)
    useEffect(() => ctl.insert(props))
    return <></>
})

export type TableProps = {
    columns?: TableColumnProps[]
    data: any[]
    children: ReactNode
}

export const TableHeader: FC<TableProps> = define((props) => {
    return <thead><tr>
        {
            props.columns?.map(col => (
                <th key={col.name} style={{width: `${col.width}%`}}>
                    {col.title ?? col.name}
                </th>
            ))}
    </tr></thead>
})

export const TableBody: FC<TableProps> = define((props) => {
    const parent = useIoC()
    return <tbody>
        {
            props.data.map((row, i) => <tr key={i}>
                {
                    props.columns?.map((col, j) => (
                        <td key={`${i}-${j}`}>
                            {col.children({ctx: parent, name: col.name, rowNum: i, data:row})}
                        </td>
                    ))
                }
            </tr>)
        }
    </tbody>
})

export const TablePropsDispatcher: PropsDispatcher<TableProps> = define((props) => {})
export interface TableController extends UniqueController<TableColumnProps> {
    updateData(rowNum: number, data: any): void
    removeData(rowNum: number): void
}


export function NewTableController(setProps: PropsDispatcher<TableProps>): TableController {
    return {
        insert(column) {
            setProps(p => {
                if (p.columns) {
                    if (p.columns.find(col => col.name == column.name)) {
                        return p
                    }
                    return {...p, columns: [...p.columns, column]}
                }
                return {...p, columns: [column]}
            })
        },
        update(column) {
            const replace = (columns?: TableColumnProps[]) => {
                if (!columns) return columns
                return columns.map(col => col.name == column.name ? column : col)
            }
            setProps(p => ({...p, columns: replace(p.columns)}))
        },
        remove(name) {
            setProps(p => {
                if (!p.columns) { return p }
                const columns = p.columns.filter(col => col.name != name)
                return {...p, columns: columns}
            })
        },
        updateData(rowNum, data) {
            const replace = (datas: any[]) => {
                return datas.map((d, index) => index == rowNum ? data : d)
            }
            setProps(p => ({...p, data: replace(p.data)}))
        },
        removeData(rowNum) {
            setProps(p => ({...p, data: p.data.filter((_, index) => index != rowNum)}))
        },
    }
}

export const Table: FC<TableProps> = define((old) => {
    const [props, setProps] = useState(old)
    const context = useIoC()
    context.define(TablePropsDispatcher, setProps)

    const tabHeader = context.inject(TableHeader)
    const tabBody = context.inject(TableBody)
    return <div className="table">
        <table>
            {tabHeader(props)}
            {tabBody(props)}
        </table>
        <div className="footer">
            {props.children}
        </div>
    </div>
})