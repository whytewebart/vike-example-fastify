import { DataAsync } from "vike/types"
import { ofetch } from "ofetch";

export { data }

const data: DataAsync = async (pageContext) => {

    console.log("url", pageContext.urlParsed)
    const plasmicEnv = pageContext.config.secrets as {
        token: string;
        databaseId: string;
    };

    const options = {
        method: "GET",
        headers: { "x-plasmic-api-cms-tokens": plasmicEnv.token },
        query: {
            q: {
                limit: 10,
                offset: Number(pageContext.urlParsed.search.page) * 10 || 0,
            },
        },
        timeout: 2000
    };

    var result: any[] = [];

    await ofetch(
        `https://data.plasmic.app/api/v1/cms/databases/${plasmicEnv.databaseId}/tables/clients/query`,
        {
            ...options,
            async onResponse({ response }) {
                if (response.status !== 200)
                    throw new Error("Failed to fetch data from Plasmic CMS");

                console.log("response", response._data)
                result = await response._data.rows;
            },
        }
    )
    .catch(e => {})

    return {
        clients: result,
    }
}