export { onBeforeRender }
import type { OnBeforeRenderAsync } from 'vike/types'
import { stringify } from './plugins/pinia/utils';

const onBeforeRender: OnBeforeRenderAsync = async (
    pageContext
): ReturnType<OnBeforeRenderAsync> => {
    const state = stringify(pageContext.store?.state.value);
    const payload: Partial<typeof pageContext> = {}

    // Update client with server pinia state
    if(pageContext.isClientSideNavigation)
        payload._piniaInitialState = state;

    return {
        pageContext: payload
    }
}