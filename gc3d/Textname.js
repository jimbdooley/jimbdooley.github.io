
const Textname = {
"next_level": {},
"download": {},
"pickaxeInstructions": {},
"pickaxeViewMap": {},
"introPlay": {},
"introSettings": {},
"score": {},
"endCheckFail": {},
"endCheckFailMsg": {},
"rainbowDescription": {},
"shapeShiftDescription": {},
"counterfeitDescription": {},
"goldNuggetDescription": {},
"pickaxeDescription": {},
"strongPickaxeDescription": {},
"rustyPickaxeDescription": {},
"platedDescription": {},
"goldenPickaxeDescription": {},
"spotSaverDescription": {},
"finishButton": {},
"returnToLevels": {},
"dragUp": {},
"dragLeft": {},
"forfeit": {},
"dontForfeit": {},
"plasmaDescription": {},
"duoDescription": {},
"inventoryDescription": {},
"close": {},
"use": {},
"firstTap": {},
"firstColor": {},
"firstFinish": {},
"firstShape": {},
"firstSwap": {},
"firstHold": {},
"firstDouble": {},
"settings": {},
"visionTypes": {},
"premiumLocked": {},
"premiumUnlocked": {},
"premiumMoreInfo": {},
"difEasy": {},
"difMedium": {},
"difHard": {},
"difCollect": {},
"difficultyHeader": {},
"firstFailable": {},
"firstCrate": {},
"unlockLevel": {},
"vtStandard": {},
"vtTritanopia": {},
"vtTritanomaly": {},
"vtRedGreen": {},
"vtMonochrome": {},
"resumeLevelFromHome": {},
"activityHeaderSelectLevel": {},
"activityHeaderGetPremium": {},
"thanksForPlaying": {},
"rateAndReview": {},
"accountInfoHeader": {},
"NOT_TRIED": {},
"UNABLE_TO_CONNECT_TO_PLAY": {},
"SIGNING_IN": {},
"CONNECTING_TO_SERVER": {},
"SIGN_IN_FAIL": {},
"SIGN_IN_SUCCESS_NOW_SYNCING": {},
"SYNC_FAIL": {},
"SYNC_INVALID_RESPONSE": {},
"SYNC_SUCCESS": {},
"refresh": {},
"try_again": {},
"sign_in": {},
"account_linked": {},
"premium_linked": {},
"buy_premium": {},
"buy_from_warning": {},
"cancel_from_warning": {},
"unlinked_warning": {},
"thanksForPurchase": {},
"adWhatYouGet": {},
"adLevels": {},
"adPlated": {},
"adShapes": {},
"adItems": {},
"adDuo": {},
"app_name": {},
"privacy_policy_text": {},
"terms_of_service_text": {},
"goldScore": {},
"goldLevel": {},
"initiatingPurchase": {},
"purchaseUnavailable": {},
"purchasePending": {},
"verifyingPurchase": {},
"purchaseFailed": {},
"purchaseNoConnection": {},
"purchaseDeclined": {},
"purchaseToast": {},
"HEART": {},
"BRIOLETTE": {},
"MARQUISE": {},
"RECTANGLE": {},
"PRINCESS": {},
"TRILLIANT": {},
"ROSE": {},
"ICO": {},
"MERKABA": {},
"DONUT": {},
"BLACK": {},
"RED": {},
"BLUE": {},
"GREEN": {},
"YELLOW": {},
"PURPLE": {},
"WHITE": {},
"LIGHT_BLUE": {},
"Math.PINK": {},
"LIGHT_GREY": {},
"MONO_WHITE": {},
"RAINBOW": {},
"COUNTERFEIT_GEM": {},
"GOLD_NUGGET": {},
"Math.PICKAXE": {},
"STRONG_Math.PICKAXE": {},
"RUSTY_Math.PICKAXE": {},
"GOLDEN_Math.PICKAXE": {},
"SHAPESHIFTER": {},
"SPOT_SAVER": {},
"PLASMA": {},
"PLATED": {},
"INVENTORY": {},
"shapeshiftTut": {},
"rainbowTut": {},
}
const textnameToRegion = {}
const TEXT_D_SCALES = []
let Textname_is = 0
let textnameStrFile = null
async function load_all_textnames(lang) {
    let strFile = await get("/strings/" + lang)
    strFile = strFile.split("\n")
    let s = ""
    for (const line of strFile) {
        if (line.indexOf("<string") == -1) continue
        const tnStart = line.indexOf("name=\"") + 6
        const tnStop = line.indexOf("\">")
        const strStart = tnStop + 2
        const strStop = line.indexOf("</string>")
        const tn = line.substring(tnStart, tnStop)
        if (!(tn in textnameToRegion)) textnameToRegion[tn] = [0, 0, 0, 0]
        s += `"${tn}": {},\n`
        if (!(tn in Textname)) Textname[tn] = {}
        if (!("ordinal" in Textname[tn])) Textname[tn].ordinal = Textname_is++
        if (!("name" in Textname[tn])) Textname[tn].name = tn
        if (!("vals" in Textname[tn])) Textname[tn].vals = {}
        Textname[tn].vals[lang] = line.substring(strStart, strStop)
    }
    //console.log(s)
    while (TEXT_D_SCALES.length < Textname_is * 2) TEXT_D_SCALES.push(0)
}



function do_button(tn, z, argb) {
    tn.btn = BButton(tn, z)
    tn.colorStr = "btnColor"
    tn.btn.setTextRegion(textnameToRegion[tn.name], false)
    tn.bmp = bitmapFromTextnameLanguageAndDXDY(
        tn, 
        tn.btn.textRegion[2],
        tn.btn.textRegion[3],
        argb,
        true,
        false,
        true,
        false,
    )
    tn.btn.setClickable()
}

const btnARGB = [255, BUTTON_COLOR[0], BUTTON_COLOR[1], BUTTON_COLOR[2]]
const btnCloseARGB = [255, BUTTON_CLOSE_COLOR[0], BUTTON_CLOSE_COLOR[1], BUTTON_CLOSE_COLOR[2]]
function set_button_regions() {
    do_button(Textname.introPlay, 0, btnARGB)
    do_button(Textname.introSettings, 0, btnARGB)
    do_button(Textname.finishButton, GEM_Z, btnARGB)
    do_button(Textname.endCheckFail, DISPLAY_Z, btnARGB)
    do_button(Textname.returnToLevels, DISPLAY_Z, btnARGB)
    do_button(Textname.download, DISPLAY_Z, btnARGB)
    do_button(Textname.next_level, DISPLAY_Z, btnARGB)
}

function do_textname(tn, color, skipOutline) {
    const region = textnameToRegion[tn.name]
    tn.bmp = bitmapFromTextnameLanguageAndDXDY(tn, region[2], region[3], color, skipOutline, false, true, false)
    
}

const INVISIBLE = [0, 0, 0, 0]
function set_textname_regions() {
    do_textname(Textname.firstTap, btnARGB, false)
    do_textname(Textname.firstColor, btnARGB, false)
    do_textname(Textname.firstFinish, btnARGB, false)
    do_textname(Textname.firstShape, btnARGB, false)
    do_textname(Textname.firstSwap, btnARGB, false)
    do_textname(Textname.firstDouble, btnARGB, false)
    do_textname(Textname.rainbowTut, btnARGB, false)
    do_textname(Textname.shapeshiftTut, btnARGB, false)
    do_textname(Textname.endCheckFailMsg, btnCloseARGB, false)
    do_textname(Textname.goldScore, INVISIBLE, true)
    do_textname(Textname.goldLevel, INVISIBLE, true)
    do_textname(Textname.thanksForPlaying, INVISIBLE, true)
}