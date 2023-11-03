
const SightType = {
    STANDARD: {i: 0},
    TRITANOPIA: {i: 1},
    TRITANONOMALY: {i: 2},
    RED_GREEN: {i: 3},
    MONOCHROME: {i: 4}
}

const Loc = {
    BROWSER_GAME: {},
    PLAYABLE_AD_GOOGLE: {}
}

const Settings = {
    loc: Loc.PLAYABLE_AD_GOOGLE,
    lang: "es", 
    intro: true,
    levelStates: [],
    playingLevel: 12,
    returnToLevelsEnable: false,
    rateable: false,
    askForRating: false,
    forfeitEnable: false,

}