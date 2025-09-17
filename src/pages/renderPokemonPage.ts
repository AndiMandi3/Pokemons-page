import '../assets/styles/style.scss'

import type { TPokemonPageData } from "../types/pokemonPage.types.ts";
import {renderPaginationForDetailPage} from "../helpers/helpers.pokemonPage.ts";
import {getPokemonPageData} from "../api/pokemonApi.ts";

function renderPokemonPage(receivedData: TPokemonPageData | null) {
    if(receivedData) {
        console.log(receivedData)

        if(receivedData.dataForPagination) {
            renderPaginationForDetailPage(receivedData?.dataForPagination)
        }
    }
}

async function runRenderDetail() {
    renderPokemonPage(await getPokemonPageData('bulbasaur'))
}

export { runRenderDetail }