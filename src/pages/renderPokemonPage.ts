import '../assets/styles/style.scss'

import type {
    TNextPrevPokemons,
    TPokemonAbilities, TPokemonDescVersions,
    TPokemonPageData
} from "../types/pokemonPage.types.ts";
import { switchDescription } from "../helpers/helpers.pokemonPage.ts";
import { getPokemonPageData } from "../api/pokemonApi.ts";
import { createHTMLElement } from "../helpers/helpers.global.ts"
import type {TPokemonPreview} from "../types/pokemonPreview.type.ts";
document.addEventListener("DOMContentLoaded", () => {

})
function renderPaginationForDetailPage(paginationData: TNextPrevPokemons | null) {
    const paginationButtons = document.querySelector<HTMLDivElement>('.pokemon-pagination__buttons')

    if(paginationData) {
        for (const [nav, name] of Object.entries(paginationData)) {

            const linkPokemon:HTMLElement = createHTMLElement('a', [`pokemon-pagination__${nav}`], {href: `/${name}`})
            if(name === null) {
                linkPokemon.setAttribute('href', location.origin)
            }

            const paginationWrapper:HTMLElement = createHTMLElement('div', ['pokemon-pagination__wrapper'])

            if(nav === 'previous') {
                const arrowLeft:HTMLElement = createHTMLElement('span', ['icon', 'icon-arrow-left'])
                paginationWrapper.appendChild(arrowLeft)
            }

            const nameSpan:HTMLElement = createHTMLElement('span', ['pokemon-pagination__name'], {textContent: name ? name.charAt(0).toUpperCase() + name.slice(1) : 'Вернуться назад'})
            paginationWrapper.appendChild(nameSpan)

            if(nav === 'next') {
                const arrowRight:HTMLElement = createHTMLElement('span', ['icon', 'icon-arrow-right'])
                paginationWrapper.appendChild(arrowRight)
            }
            linkPokemon.appendChild(paginationWrapper)
            paginationButtons?.appendChild(linkPokemon)
        }
    }
}


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

        const imgPokemon: HTMLElement = createHTMLElement('img', [], {alt: receivedData?.name, src: receivedData?.img, loading: 'lazy'})
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

        const descriptionPokemon: HTMLElement = createHTMLElement('p', ['pokemon-detail__description'], {textContent: receivedData?.description?.blue ?? 'No data'})
        rightSidePokemon.appendChild(descriptionPokemon)

        const versionsPokemonWrapper: HTMLElement = createHTMLElement('div', ['pokemon-detail__pokemon-versions'])
        const versionsSpan: HTMLElement = createHTMLElement('span', [],  {textContent: "Versions"})
        versionsPokemonWrapper.appendChild(versionsSpan)

        if(receivedData.description) {
            for(const [version] of Object.entries(receivedData.description)) {
                const versionWrapper: HTMLElement = createHTMLElement('div', ['pokemon-detail__version', `version-${version}`], {'data-version': version})
                if(version === 'blue') {
                    versionWrapper.classList.add('active')
                }

                versionWrapper.addEventListener('click', () => {
                    switchDescription(version as keyof TPokemonDescVersions, receivedData.description)
                })

                const versionIcon:HTMLElement = createHTMLElement('span', ['icon', 'icon-pokeball'])

                versionWrapper.appendChild(versionIcon)
                versionsPokemonWrapper.appendChild(versionWrapper)
            }
            rightSidePokemon.appendChild(versionsPokemonWrapper)

        }

        const pokemonInfoWrapper: HTMLElement = createHTMLElement('div', ['pokemon-detail__pokemon-info'])
        const pokemonInfo: HTMLElement = createHTMLElement('div', ['pokemon-detail__ability-info'])
        for (const [name, value] of Object.entries(receivedData.mainInfo)) {

            const container: HTMLElement = createHTMLElement('div', ['penis'])
            const infoTitle: HTMLElement = createHTMLElement('p', ['attribute-title'], {textContent: name})
            container.appendChild(infoTitle)

            let infoValue: HTMLElement = createHTMLElement('p', ['attribute-value'], {textContent: (name === 'Gender' || name === 'Abilities' || name === 'Category') ? '' : `${value}`})

            if(name === 'Abilities') {
                for(const ability of receivedData.mainInfo.Abilities) {
                    infoValue = createHTMLElement('p', ['attribute-value', 'more-info'],
                        {textContent: (ability.nameAbility).charAt(0).toUpperCase() + ability.nameAbility.slice(1),
                            'data-ability': (ability.nameAbility).charAt(0).toUpperCase() + ability.nameAbility.slice(1)})

                    infoValue.addEventListener('click', () => {
                        renderAbilityWindow(pokemonInfoWrapper, ability)
                    })
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

        renderEvolutionPokemon(receivedData.evolution)
        renderButtonToMain()
    } else {
        pokemonDetailContainer!.innerHTML = "No data for preview"
    }

}

function renderEvolutionPokemon(evolutionChain: TPokemonPreview[]) {
    const evolutionSection = document.querySelector<HTMLElement>('.pokemon-evolution')

    if(evolutionChain && evolutionSection) {

        const evolutionWrapper: HTMLElement = createHTMLElement('div', ['pokemon-evolution__wrapper'])
        const wrapperHeader: HTMLElement = createHTMLElement('div', ['pokemon-evolution__header'])
        const header: HTMLElement = createHTMLElement('h3', [], {textContent: 'Evolutions'})

        wrapperHeader.appendChild(header)
        evolutionWrapper.appendChild(wrapperHeader)
        evolutionSection.appendChild(evolutionWrapper)

        const bodyEvolution: HTMLElement = createHTMLElement('div', ['pokemon-evolution__body'])
        if(evolutionChain.length > 3) {
            const firstEvolution = evolutionChain[0]
            const lastsEvolutions = evolutionChain.slice(1)

            cardForEvolutionPokemon(firstEvolution, bodyEvolution, 'with-separator')

            const separator: HTMLElement = createHTMLElement('div', ['pokemon-evolution__separator'])
            bodyEvolution.appendChild(separator)

            for(const evolutions of lastsEvolutions) {
                cardForEvolutionPokemon(evolutions, separator, 'with-separator')
            }

        } else {
            for(const evolution of evolutionChain) {
                cardForEvolutionPokemon(evolution, bodyEvolution)
            }
        }

        evolutionWrapper.appendChild(bodyEvolution)
    }
}

function cardForEvolutionPokemon(evolution: TPokemonPreview, container: HTMLElement, cssClass?: string) {
    const linkWrapper:HTMLElement = createHTMLElement('a', ['pokemon-evolution__pokemon-card'], {href: `/${evolution.name}`})
    const imgWrapper:HTMLElement = createHTMLElement('div', ['pokemon-evolution__img'])
    const imgPokemon: HTMLElement = createHTMLElement('img', [], {src: evolution.img, alt: evolution.name, loading: 'lazy'})

    imgWrapper.appendChild(imgPokemon)
    linkWrapper.appendChild(imgWrapper)

    const infoWrapper: HTMLElement = createHTMLElement('div', ['pokemon-evolution__pokemon-info'])
    const namePokemon: HTMLElement = createHTMLElement('h3', ['pokemon-evolution__pokemon-name'], {textContent: evolution.name.charAt(0).toUpperCase() + evolution.name.slice(1) +  ' '})
    const idPokemon: HTMLElement = createHTMLElement('span', [], {textContent: `#${(evolution.id/1000).toFixed(3).replace('.', '')}`})

    namePokemon.appendChild(idPokemon)

    const abilitiesPokemonWrapper:HTMLElement = createHTMLElement('div', ['pokemon__abilities'])

    for(const type of evolution.types) {
        const typeSpan:HTMLElement = createHTMLElement('span', [], {textContent: type.charAt(0).toUpperCase() + type.slice(1)})
        abilitiesPokemonWrapper.appendChild(typeSpan)
    }

    infoWrapper.appendChild(namePokemon)
    infoWrapper.appendChild(abilitiesPokemonWrapper)
    linkWrapper.appendChild(infoWrapper)
    if(cssClass) {
        linkWrapper.classList.add(cssClass)
    }

    container.appendChild(linkWrapper)

}

function renderButtonToMain() {
    const buttonWrapper = document.querySelector<HTMLDivElement>('.explore-more.full-content')
    if (buttonWrapper) {
        const buttonToMain: HTMLElement = createHTMLElement('a', ['full-content__button', 'button', 'button--orange'], {textContent: 'Explore More ', href: location.host})
        const markeredText: HTMLElement = createHTMLElement('b', [], {textContent: 'Pokemon'})

        buttonToMain.appendChild(markeredText)
        buttonWrapper.appendChild(buttonToMain)
    }
}

function renderAbilityWindow(container: HTMLElement, abilityData: TPokemonAbilities) {
    const abilityDescWrapper: HTMLElement = createHTMLElement('div', ['pokemon-detail__ability-desc'])
    const abilityDescHeader: HTMLElement = createHTMLElement('div', ['pokemon-detail__ability-desc__header'])
    const headerText: HTMLElement = createHTMLElement('h3', [], {textContent: 'Ability Info'})

    abilityDescHeader.appendChild(headerText)
    abilityDescWrapper.appendChild(abilityDescHeader)

    const closeBtnWrapper: HTMLElement = createHTMLElement('div', ['close-button'])
    const closeBtn: HTMLElement = createHTMLElement('button', [], {type: 'button', 'aria-label': 'Close', textContent: 'Close'})

    closeBtnWrapper.appendChild(closeBtn)
    abilityDescHeader.appendChild(closeBtnWrapper)

    const abilityDescBody:HTMLElement = createHTMLElement('div', ['pokemon-detail__ability-desc__body'])
    const abilityTitle: HTMLElement = createHTMLElement('h3', ['ability-title'], {textContent: abilityData.nameAbility})
    const abilityText: HTMLElement = createHTMLElement('p', ['ability-text'], {textContent: abilityData.descriptionAbility})
    abilityDescBody.appendChild(abilityTitle)
    abilityDescBody.appendChild(abilityText)
    abilityDescWrapper.appendChild(abilityDescBody)
    container.appendChild(abilityDescWrapper)

    closeBtn.addEventListener('click', () => {
        abilityDescWrapper.remove()
    })
}

async function runRenderDetail() {
    renderPokemonPage(await getPokemonPageData('bulbasaur'))
}

export { runRenderDetail }