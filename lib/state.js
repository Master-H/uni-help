
/**
 * @file state
 * @author master
 *
 * 状态管理
 */
class GlobalState {
    constructor() {
        this.state = {};
    }

    init(state) {
        this.state = {...state};
    }

    getState() {
        return {...this.state};
    }

    setState(newState) {
        this.state = {...this.state, ...newState};
    }
}

const globalState = new GlobalState();

module.exports = globalState;


