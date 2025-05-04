import { DataAsync } from "vike/types"
import { ofetch } from "ofetch";

export { data }

const data: DataAsync = async (pageContext) => {

    return {
        clients: []
    }

    const plasmicEnv = pageContext.config.secrets as {
        token: string;
        databaseId: string;
    };

    const options = {
        method: "GET",
        headers: { "x-plasmic-api-cms-tokens": plasmicEnv.token },
        query: {
            q: {
                limit: 3,
            },
        },
    };

    var result: any[] = [];

    await ofetch(
        `https://data.plasmic.app/api/v1/cms/databases/${plasmicEnv.databaseId}/tables/clients/query`,
        {
            ...options,
            async onResponse({ response }) {
                if (response.status !== 200)
                    throw new Error("Failed to fetch data from Plasmic CMS");

                result = await response._data.rows;
            }
        }
    )
    .catch(e => console.log(e))

    console.log("Ran on +data", result.flatMap((client) => client.data));

    return {
        clients: result,
    }
}