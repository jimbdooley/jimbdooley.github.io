
const JumpState = {
    NOT_PAST_1: 0,
    PAST_1: 1,
    RETURNED_BELOW_1: 2,
}

const Ball = {
    MAX_MZ: 0.4,
    MIN_Z: 0.05,
    G_FORCE: 1,
    dobb: DisplayObjectBall([0, 0, 4], [1, 1, 1], 0, 0, 0),
    pnit: cubeCirclePNIT(24),
    mass: 1,
    xR: 0,
    skin: "ball",
    mz: 0,
    pLane: 0,
    _lane: 0,
    set lane(val) {
        this.pLane = this._lane
        this._lane = val
    },
    get lane() {
        return this._lane
    },
    jumpState: JumpState.PAST_1,
    jump() {
        if (this.jumpState == JumpState.RETURNED_BELOW_1) {
            this.G_FORCE = 1
            this.mz = 0.65
            this.jumpState = JumpState.NOT_PAST_1
        }
    },
    down() {
        this.G_FORCE = 9
    },
    inLane() {
        let rtn = false
        rtn = rtn || (this.lane == -1 && 0.001 > Math.abs(this.dobb.x + LANE_SPACE))
        rtn = rtn || (this.lane == 0 && 0.001 > Math.abs(this.dobb.x))
        rtn = rtn || (this.lane == 1 && 0.001 > Math.abs(this.dobb.x - LANE_SPACE))
        return rtn
    },
    left() {
        if (!this.inLane() || this.lane == -1) return
        this.lane -= 1
    },
    right() {
        if (!this.inLane() || this.lane == 1) return
        this.lane += 1
    },
    last3z: [],
    iterate(dt) {
        const units = dt * 0.06 // units of time, 16.66 * 0.06 = 1
        // rotation logicd
        this.dobb.thX += 0.0071 * dt

        // z force logic
        const g_force = -5 * this.G_FORCE
        const distFromFloor = Math.min(1, Math.max(0.1, this.dobb.z))
        const floor_force = this.dobb.z < 1 ? 4 / distFromFloor : 0
        const dMomentum = this.mass * (floor_force + g_force) * 0.0038 * units
        this.mz = Math.min(this.MAX_MZ, this.mz + dMomentum)
        this.mz *= this.jumpState == JumpState.RETURNED_BELOW_1 ? 0.97 : 0.99
        this.dobb.z = Math.max(this.MIN_Z, this.dobb.z + this.mz)


        // logic for lane change
        const changeR1 = -this.lane + this.dobb.x/LANE_SPACE
        const changeR = changeR1 < 0 ? -1 - changeR1 : 1 - changeR1
        this.dobb.thTilt = 0.8*Math.min(1-Math.abs(changeR), Math.abs(changeR))
        this.dobb.thK = (this.dobb.x < this.lane*LANE_SPACE ? Math.PI : 0) + 0.5 * Math.PI
        if (this.xR < this.lane) {
            this.xR= Math.min(this.lane, this.xR + 0.068 * units)
        } else if (this.xR > this.lane) {
            this.xR = Math.max(this.lane*LANE_SPACE, this.xR - 0.068 * units)
        }
        const sign = this.dobb.x > 0 || this.lane > 0 ? 1 : -1
        this.dobb.x = sign * sCurve(Math.abs(this.xR)) * LANE_SPACE
        
        // logic for jumping
        if (this.jumpState == JumpState.NOT_PAST_1) {
            if (this.dobb.z > 1) this.jumpState = JumpState.PAST_1
        }
        if (this.jumpState == JumpState.PAST_1) {
            if (this.dobb.z <= 1 && this.mz < 0) {
                this.jumpState = JumpState.RETURNED_BELOW_1
            }
        } 
        
        if (this.jumpState == JumpState.RETURNED_BELOW_1) {

        }

    },
}