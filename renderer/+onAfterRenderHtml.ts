export { onAfterRenderHtml }

import type { PageContextServer } from 'vike/types'
import { stringify } from './plugins/pinia/utils';

const onAfterRenderHtml= async (pageContext: PageContextServer) => {
    // Set server pinia state
    const state = stringify(pageContext.store?.state.value);
    pageContext._piniaInitialState = state;
}

declare global {
    namespace Vike {
        interface PageContext {
            _piniaInitialState?: string;
        }
    }
}