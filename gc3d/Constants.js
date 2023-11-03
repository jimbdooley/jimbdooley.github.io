const DEFAULT_LANG = "en"

const GEM_UNIT = 1
const CAM_Z_GC = 48
const FOV_FOR_MAX = 0.27
const FAR = 100
const SCENE_0 = CAM_Z_GC - FAR + 22
const BRICK_Z = CAM_Z_GC - FAR + 2
const BOARD_Z = -10
const WIDGET_Z = -7
const GEM_Z = -7
const HAND_CENTER_DOB_Z = GEM_Z + 3
const MAX_MAP_SCALE = 1.1
const DISPLAY_Z = 0
const SHADE_Z = 0.5 * (DISPLAY_Z + GEM_Z)
const OCT_SIDE_R = 0.37

const ROW_SHOW_PERIOD_S = 2.27
const KEEP_NUM_MAX = 3
const NUGGET_ANIM_TIME = 2400
const BLK_INDICATOR_DELAY_MS = 300

let DISPLAY_TITLE_H_R = 0.2
let DISPLAY_TEXT_H_R = 0.5
let DISPLAY_OTHER_H_R = 0.176
let DISPLAY_SPACE_H_R = 0.032
const DISPLAY_DENOM = 1 + 2*DISPLAY_TITLE_H_R + DISPLAY_TEXT_H_R + DISPLAY_OTHER_H_R + 4 * DISPLAY_SPACE_H_R
const DISPLAY_HORIZONTAL_SPACE_R = 0.05


const BUTTON_COLOR = [145, 175, 255]
const BUTTON_CLOSE_COLOR = [225, 105, 105]


const PIF = Math.PI
const ONE_THIRD = 1 / 3
const GOLD_COLOR = [1, 0.9, 0]