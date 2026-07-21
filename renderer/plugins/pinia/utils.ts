import { StateTree } from "pinia";

export {
    serialize,
    stringify
}

const serialize = (state?: string): StateTree => {
    const formatted = state ? JSON.parse(state) : state;
    return formatted
}

const stringify = (state?: StateTree) => {
    return state ? JSON.stringify(state) : state
}