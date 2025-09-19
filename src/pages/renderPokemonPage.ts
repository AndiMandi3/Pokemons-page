import '../assets/styles/style.scss'

import type { TPokemonPageData } from "../types/pokemonPage.types.ts";
import { renderPaginationForDetailPage } from "../helpers/helpers.pokemonPage.ts";
import { getPokemonPageData } from "../api/pokemonApi.ts";
import { createHTMLElement } from "../helpers/helpers.global.ts"

function renderPokemonPage(receivedData: TPokemonPageData | null) {
    const paginationContainer = document.querySelector<HTMLDivElement>(".pokemon-pagination");
    const pokemonDetailContainer = document.querySelector<HTMLDivElement>('.pokemon-detail')
    const leftSidePokemon: HTMLElement = createHTMLElement('div', ['pokemon-detail__left-side'])
    const rightSidePokemon: HTMLElement = createHTMLElement('div', ['pokemon-detail__right-side'])

    if(receivedData) {
        console.log(receivedData)

        if(receivedData.dataForPagination) {
            renderPaginationForDetailPage(receivedData?.dataForPagination)
        }

        const titlePokemon: HTMLElement = createHTMLElement('h1', ['pokemon-pagination__title'], {textContent: (receivedData.name).charAt(0).toUpperCase() + (receivedData.name.slice(1)) +  ' '})
        const idPokemon: HTMLElement = createHTMLElement('span', [], {textContent: `#${(receivedData.id/1000).toFixed(3).replace('.', '')}`})
        titlePokemon.appendChild(idPokemon)
        paginationContainer?.appendChild(titlePokemon)

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
            const countFilledCells = Math.min(Math.round(stat.valueStat / 15), 15)

            for(let i = 0; i < 15; i++) {
                const statCell:HTMLElement = createHTMLElement('div', ['cell'])
                if(i >= 15 - countFilledCells) {
                    statCell.classList.add('active')
                }
                statColumn.appendChild(statCell)
            }

            const statName: HTMLElement = createHTMLElement('span', [], {textContent: stat.nameStat})
            statColumn.appendChild(statName)
            tableSpecification.appendChild(statColumn)
        }
        statsWrapper.appendChild(tableSpecification)
        leftSidePokemon.appendChild(statsWrapper)
        pokemonDetailContainer?.append(leftSidePokemon)

        const descriptionPokemon: HTMLElement = createHTMLElement('p', ['pokemon-detail__description'], {textContent: receivedData.description.blue})
        rightSidePokemon.appendChild(descriptionPokemon)

        const versionsPokemonWrapper: HTMLElement = createHTMLElement('div', ['pokemon-detail__pokemon-versions'])
        const versionsSpan: HTMLElement = createHTMLElement('span', [],  {textContent: "Versions"})
        versionsPokemonWrapper.appendChild(versionsSpan)

        for(const [version] of Object.entries(receivedData.description)) {
            const versionWrapper: HTMLElement = createHTMLElement('div', ['pokemon-detail__version', `version-${version}`])
            if(version === 'blue') {
                versionWrapper.classList.add('active')
            }

            const versionIcon:HTMLElement = createHTMLElement('span', ['icon', 'icon-pokeball'])

            versionWrapper.appendChild(versionIcon)
            versionsPokemonWrapper.appendChild(versionWrapper)
        }
        rightSidePokemon.appendChild(versionsPokemonWrapper)

        const pokemonInfoWrapper: HTMLElement = createHTMLElement('div', ['pokemon-detail__pokemon-info'])
        const pokemonInfo: HTMLElement = createHTMLElement('div', ['pokemon-detail__ability-info'])
        for (const [name, value] of Object.entries(receivedData?.mainInfo)) {

            const container: HTMLElement = createHTMLElement('div', [])
            const infoTitle: HTMLElement = createHTMLElement('p', ['attribute-title'], {textContent: name})
            container.appendChild(infoTitle)

            let infoValue: HTMLElement = createHTMLElement('p', ['attribute-value'], {textContent: (name === 'Gender' || name === 'Abilities' || name === 'Category') ? '' : `${value}`})

            if(name === 'Abilities') {
                infoValue.classList.add('more-info')
                for(const ability of receivedData?.mainInfo?.Abilities) {
                    infoValue = createHTMLElement('p', ['attribute-value', 'more-info'], {textContent: (ability.nameAbility).charAt(0).toUpperCase() + ability.nameAbility.slice(1)})
                    container.appendChild(infoValue)
                }
            }

            if(name === 'Category') {
                for (const category of receivedData?.mainInfo?.Category) {
                    infoValue.textContent = (category.split(' ').splice(0, 1).toString())
                }
            }

            if(name === 'Gender') {
                for(const gender of receivedData?.mainInfo?.Gender) {
                    const genderIcon:HTMLElement = createHTMLElement('span', ['icon', `icon-${gender}`])
                    infoValue.appendChild(genderIcon)
                }
            }

            container.appendChild(infoValue)
            pokemonInfo.appendChild(container)
        }
        pokemonInfoWrapper.appendChild(pokemonInfo)
        rightSidePokemon.appendChild(pokemonInfoWrapper)

        const attributes:HTMLElement = createHTMLElement('div', ['pokemon-detail__attributes'])

        for(const [attribute, innerAttribute] of Object.entries(receivedData?.attributes)) {
            const attributePokemon: HTMLElement = createHTMLElement('div', [`pokemon-detail__pokemon-${attribute}`])
            const anchor:HTMLElement = createHTMLElement('h3', [], {textContent: attribute})
            attributePokemon.appendChild(anchor)

            const attributeWrapper:HTMLElement = createHTMLElement('div', ['pokemon__abilities'])
            attributePokemon.appendChild(attributeWrapper)

            for(const data of innerAttribute) {
                const attributeValue:HTMLElement = createHTMLElement('span', [], {textContent: data})
                attributeWrapper.appendChild(attributeValue)
            }
            attributes.appendChild(attributePokemon)
            rightSidePokemon.appendChild(attributes)

        }
        pokemonDetailContainer?.appendChild(rightSidePokemon)
        console.log(rightSidePokemon)
    }

}

async function runRenderDetail() {
    renderPokemonPage(await getPokemonPageData('19'))
}

export { runRenderDetail }