import { Once } from 'Com/once';
import { FC, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { Context, useIoC } from "../../hooks/ioc";
import { Controller, NameEqualizer, NewController, PropsDispatcher } from '../container';

export type TableColumnProps<T> = {
    name: string
    title: ReactNode
    width?: number
    children: FC<{name: string, rowNum: number, data: T}>
}

export function TableColumn<T>(props: TableColumnProps<T>) {
    const context = useIoC()
    
    useEffect(() => {
        const setProps = context.inject(TablePropsDispatcher)
        const ctl = NewTableController<T>(setProps)
        ctl.updateOrInsert(props)
    }, [context, props])
    return <></>
}

export function TablePropsDispatcher<T>(props: SetStateAction<T>) {}
export interface TableController<T> extends Controller<TableColumnProps<T>> {
    updateOrInsert(column: TableColumnProps<T>): void
    setData(dataSet: T[]): void
    appendData(...data: T[]): void
    updateData(rowNum: number, data: T): void
    removeData(rowNum: number): void
}

export type TableArgs<T> = {
    ctx: Context
    ctl: TableController<T>
    Column: FC<TableColumnProps<T>>
}

export type TableProps<T> = {
    data: T[]
    children: FC<TableArgs<T>>
}

interface TP<T> {
    data: T[]
    columns: TableColumnProps<T>[]
}

export function TableHeader<T>(props: TP<T>) {
    return <thead>
        <tr>{
            props.columns.map(col => (
                <th key={col.name} style={{width: `${col.width}%`}}>
                    {col.title ?? col.name}
                </th>
            ))
        }</tr>
    </thead>
}

export function TableBody<T>(props: TP<T>) {
    return <tbody>{
        props.data.map((row, i) => <tr key={i}>{
            props.columns.map((col, j) => (
                <td key={`${i}-${j}`}>
                    {col.children({name: col.name, rowNum: i, data: row})}
                </td>
            ))
        }</tr>)
    }</tbody>
}

export function NewTableController<T>(setProps: PropsDispatcher<TP<T>>): TableController<T> {
    const setColumns: PropsDispatcher<TableColumnProps<T>[]> = (action) => setProps(p => {
        const columns = (typeof action == "function") ? action(p.columns) : action
        return {...p, columns: columns}
    })
    const ctl = NewController<TableColumnProps<T>>(setColumns, NameEqualizer)
    return {
        ...ctl,
        updateOrInsert(column) {
            setProps(p => {
                const index = p.columns.findIndex(col => col.name == column.name)
                if (index >= 0) {
                    const matched = p.columns[index]
                    if (matched.name == column.name && matched.title == column.title) {
                        return p
                    }
                    return {...p, columns: p.columns.splice(index, 1, column)}
                } 
                return {...p, columns: [...p.columns, column]}
            })
        },
        setData(dataSet) {
            setProps(p => ({...p, data: dataSet}))
        },
        appendData(...data: T[]) {
            setProps(p => ({...p, data: [...p.data, ...data]}))
        },
        updateData(rowNum, data) {
            const replace = (dataSet: T[]) => {
                return dataSet.map((d, index) => index == rowNum ? data : d)
            }
            setProps(p => ({...p, data: replace(p.data)}))
        },
        removeData(rowNum) {
            setProps(p => ({...p, data: p.data.filter((_, index) => index != rowNum)}))
        },
    }
}

export function Table<T>(old: TableProps<T>) {
    const [props, setProps] = useState<TP<T>>({data: old.data, columns: []})
    const context = useIoC()
    context.define(TablePropsDispatcher, setProps)

    const tabHeader = context.inject(TableHeader<T>)
    const tabBody = context.inject(TableBody<T>)
    return <div className="table">
        <table>
            {tabHeader(props)}
            {tabBody(props)}
        </table>
        <div className="footer">
            <Once>{
                () => old.children({
                    ctx: context,
                    ctl: NewTableController<T>(setProps),
                    Column: TableColumn<T>
                })
            }</Once>
        </div>
    </div>
}