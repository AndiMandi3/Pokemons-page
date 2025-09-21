import type { TPokemonDescVersions } from "../types/pokemonPage.types.ts";


function switchDescription(version: keyof TPokemonDescVersions, descriptions: TPokemonDescVersions | null) {
    const descriptionElement = document.querySelector<HTMLDivElement>('.pokemon-detail__description')
    if(descriptionElement) {
        descriptionElement.textContent = descriptions?.[version] || 'No data'
    }
    updateActivePokeBall(version)
}

function updateActivePokeBall(activeVersion: string) {
    const allVersionsPokemon = document.querySelectorAll<HTMLDivElement>('.pokemon-detail__version')
    allVersionsPokemon.forEach(version => {version.classList.remove('active')})

    const selectedWrapper = document.querySelector<HTMLDivElement>(`[data-version=${activeVersion}]`)
    if(selectedWrapper) {
        selectedWrapper.classList.add('active')
    }
}

export { switchDescription }