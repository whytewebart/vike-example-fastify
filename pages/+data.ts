export { data };
export type Data = Awaited<ReturnType<typeof data>>;

import { ofetch } from "ofetch";
import type { PageContextServer } from "vike/types";
import { Asset, SharedMeta } from "@/renderer/types/plasmic";

export type Response = {
  apps?: AppData[];
  clients?: Client[];
};

type ResponseErr = {
  apps: Error | null;
  clients: Error | null;
};

interface AppData extends SharedMeta {
  data: {
    logo: Asset;
    appName: string;
    published: boolean;
    url?: string;
    priority?: number;
  };
}

interface Client extends SharedMeta {
  data: {
    client: string;
    overview: string;
    published: string;
    services: unknown[];
    thumbnail: Asset;
    projectType: string;
    url: string;
  };
}

async function data(pageContext: PageContextServer) {
  const { secrets } = pageContext.config;
  const { token, databaseId } = secrets!;

  const endpoint = (table: string) =>
    `https://data.plasmic.app/api/v1/cms/databases/${databaseId}/tables/${table}/query`;

  const options = {
    method: "GET" as const,
    timeout: 2000,
    headers: {
      "x-plasmic-api-cms-tokens": token,
    },
    query: {
      q: {
        limit: 3,
      },
    },
  };

  async function fetchTable<T>(table: string) {
    try {
      const response = await ofetch<{ rows: T[] }>(endpoint(table), options);

      return {
        data: response.rows,
        error: null,
      };
    } catch {
      return {
        data: undefined,
        error: new Error("Failed to fetch data from Plasmic CMS"),
      };
    }
  }

  const [{ data: clients, error: clientsError }, { data: apps, error: appsError }] =
    await Promise.all([
      fetchTable<Client>("clients"),
      fetchTable<AppData>("apps"),
    ]);

  return {
    apps,
    clients,
    error: {
      apps: appsError,
      clients: clientsError,
    },
  };
}
