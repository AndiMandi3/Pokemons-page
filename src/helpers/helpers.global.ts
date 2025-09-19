function createHTMLElement<T extends keyof HTMLElementTagNameMap>(T: string, classes: string[] = [], options?: Partial<HTMLElementTagNameMap[T]> & Record<string, string> ): HTMLElement{
    const el = document.createElement(T)
    
    el.classList.add(...classes)


    if(options) {
        Object.entries(options).forEach(([key, value]) => {
            if(key in  el) {
                (el as any)[key] = value
            } else {
                if(value) el.setAttribute(key, value.toString())
            }
        })
    }
    return el
}

export { createHTMLElement }