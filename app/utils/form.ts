
export interface Form {
    getString(name: string): string | undefined
    getNumber(name: string): number | undefined
    getDate(name: string): Date | undefined
    getFile(name: string): File | undefined
}

export function NewForm(form: HTMLFormElement): Form {
    const data = new FormData(form)
    return {
        getString(name) {
            const val = data.get(name)
            if (val == null || val instanceof File) {
                return undefined
            }
            return val
        },
        getNumber(name) {
            const val = this.getString(name)
            return val != undefined ? Number.parseFloat(val) : val
        },
        getDate(name) {
            const val = this.getNumber(name)
            return val != undefined ? new Date(val) : val
        },
        getFile(name) {
            const val = data.get(name)
            return (val != null && val instanceof File) ? val : undefined
        },
    }
}