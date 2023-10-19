
export interface Form {
    getString(name: string): string | undefined
    getNumber(name: string): number | undefined
    getDate(name: string): Date | undefined
}

export function NewForm(form: HTMLFormElement): Form {
    const data = new FormData(form)
    return {
        getString(name) {
            const val = data.get(name)
            if (val != null && typeof val == "string") {
                return val
            }
            return undefined
        },
        getNumber(name) {
            const val = this.getString(name)
            return val != undefined ? Number.parseFloat(val) : val
        },
        getDate(name) {
            const val = this.getNumber(name)
            return val != undefined ? new Date(val) : val
        }
    }
}