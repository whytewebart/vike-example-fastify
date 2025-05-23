import wineJson from "./wines.json";

const _wineImages = import.meta.glob('./assets/wines/*.png', {
    eager: true,
    import: "default",
    // query: "?extractExportNames",
})


// console.log(_wineImages)

function getMatchingImagePath(name: string) {
    return Object.keys(_wineImages).find(path => {
        const filename = path.split('/').pop()?.split('.')[0];
        return filename === name;
    });
}

export const escudoWines = wineJson.map(({ image, ...rest }) => {

    return {
        ...rest,
        image: _wineImages[getMatchingImagePath(rest.name.toLowerCase().replaceAll(' ', '-')) || ''] as string
    }
})