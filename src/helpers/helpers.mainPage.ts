import type { TPokemonPreview } from "../types/pokemonPreview.type"
import { renderPokemons, runResults } from "../pages/renderMain"

let globalLimit: number = 12

const sortResultSelector: HTMLSelectElement | null = document.querySelector("#sort-selector")
const loadMoreButton: HTMLButtonElement | null = document.querySelector('#loadMore')
const showFiltersButton = document.querySelector<HTMLButtonElement>("#showAdvSearch")


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

function clearResults() {
    const resultDiv: HTMLDivElement | null = document.querySelector('.result__row')
    if (resultDiv && resultDiv.innerHTML) {
        resultDiv.innerHTML = ''
    }
}

function sortResult(pokemonsArray: TPokemonPreview[]): TPokemonPreview[] {
    if(!sortResultSelector || pokemonsArray.length === 0) {
        return pokemonsArray
    }

    const sortStrategies = new Map<string, (arr: TPokemonPreview[]) => TPokemonPreview[]>([
        ["ascId", (arr) => [...arr].sort((a, b) => a.id - b.id)],
        ["descId", (arr) => [...arr].sort((a, b) =>  b.id - a.id)],
        ["ascName", (arr) => [...arr].sort((a, b) => a.name.localeCompare(b.name))],
        ["descName", (arr) => [...arr].sort((a, b) => b.name.localeCompare(a.name))]
    ])

        sortResultSelector.addEventListener('change', async() => {
            const choosedStrategie = sortStrategies.get(sortResultSelector.value)

            if(choosedStrategie) {
                clearResults()
                const sortedArray = choosedStrategie(pokemonsArray)
                await renderPokemons(sortedArray)
            }
        })
        
        return pokemonsArray
    }
    

if (loadMoreButton) {
    loadMoreButton.addEventListener('click', async() => {
        clearResults()
        globalLimit += 12
        await runResults()
    })
}

if(showFiltersButton) {
    const filterWrap: HTMLDivElement | null = document.querySelector(".filter__wrap")
    showFiltersButton.addEventListener('click', () => {
        if (filterWrap) {

            if(filterWrap.style.height === '0px') {
                showFiltersButton.textContent = "Hide Advanced Search"
                filterWrap!.style.height = 'inherit'

            } else if(filterWrap.style.height === 'inherit') {
                showFiltersButton.textContent = "Show Advanced Search"
                filterWrap.style.height = '0px'
            }
        }
    })
}

export { sortResult, globalLimit, createHTMLElement }