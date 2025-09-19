import '../assets/styles/style.scss'

import type { TPokemonPageData } from "../types/pokemonPage.types.ts";
import { renderPaginationForDetailPage } from "../helpers/helpers.pokemonPage.ts";
import { getPokemonPageData } from "../api/pokemonApi.ts";
import { createHTMLElement } from "../helpers/helpers.global.ts"

function renderPokemonPage(receivedData: TPokemonPageData | null) {
    const pokemonDetailContainer = document.querySelector<HTMLDivElement>('.pokemon-detail')
    const leftSidePokemon: HTMLElement = createHTMLElement('div', ['pokemon-detail__left-side'])
    const rightSidePokemon: HTMLElement = createHTMLElement('div', ['pokemon-detail__right-side'])

    if(receivedData) {
        console.log(receivedData)

        if(receivedData.dataForPagination) {
            renderPaginationForDetailPage(receivedData?.dataForPagination)
        }

        const imgWrapper: HTMLElement = createHTMLElement('div', ['pokemon-detail__pokemon-image'])

        const imgPokemon: HTMLElement = createHTMLElement('img', [], {alt: receivedData?.name, src: receivedData?.img})
        imgWrapper.appendChild(imgPokemon)
        leftSidePokemon.appendChild(imgWrapper)
        
        const statsWrapper:HTMLElement = createHTMLElement('div', ['pokemon-detail__pokemon-stats'])
        const anchorStats:HTMLElement = createHTMLElement('h3', [], {textContent: "Stats"})

        statsWrapper.appendChild(anchorStats)

        const tableSpecification: HTMLElement = createHTMLElement('div', ['pokemon-detail__columns-specifications'])
        for (const stat of receivedData?.stats) {

            const statColumn:HTMLElement = createHTMLElement('div', ['column', `pokemon-detail__column-${stat.nameStat}`])
            const countFilledCells = Math.round(stat.valueStat)

            for(let i = 0; i < 15; i++) {
                const statCell:HTMLElement = createHTMLElement('div', ['cell'])

                for(let j = 0; j < countFilledCells; j+15) {
                    console.log('active')
                }
                
                statColumn.appendChild(statCell)
            }
            tableSpecification.appendChild(statColumn)
        }
        console.log(tableSpecification)
    }

}

async function runRenderDetail() {
    renderPokemonPage(await getPokemonPageData('bulbasaur'))
}

export { runRenderDetail }