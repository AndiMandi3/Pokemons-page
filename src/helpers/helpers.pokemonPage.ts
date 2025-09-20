import type { TNextPrevPokemons } from "../types/pokemonPage.types.ts";

function renderPaginationForDetailPage(paginationData: TNextPrevPokemons) {
    const paginationButtons = document.querySelector<HTMLDivElement>('.pokemon-pagination__buttons')

    if(paginationData.previous || paginationData.next) {
        for (const [nav, name] of Object.entries(paginationData)) {

            const linkPokemon = document.createElement('a')
            linkPokemon.setAttribute('href', `${location.host}/${name}`)
            if(name === null) {
                linkPokemon.setAttribute('href', location.host)
            }
            linkPokemon.classList.add(`pokemon-pagination__${nav}`)

            const paginationWrapper = document.createElement('div')
            paginationWrapper.classList.add('pokemon-pagination__wrapper')


            if(nav === 'previous') {
                const arrowLeft = document.createElement('span')
                arrowLeft.classList.add('icon', 'icon-arrow-left')
                paginationWrapper.appendChild(arrowLeft)
            }

            const nameSpan = document.createElement('span')
            nameSpan.classList.add('pokemon-pagination__name')
            nameSpan.textContent = name
            if(name === null) {
                nameSpan.textContent = 'Вернуться назад'
            }
            paginationWrapper.appendChild(nameSpan)

            if(nav === 'next') {
                const arrowRight = document.createElement('span')
                arrowRight.classList.add('icon', 'icon-arrow-right')
                paginationWrapper.appendChild(arrowRight)
            }
            linkPokemon.appendChild(paginationWrapper)
            paginationButtons?.appendChild(linkPokemon)
        }
    }
}
export { renderPaginationForDetailPage}