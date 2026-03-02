import puter from "@heyputer/puter.js";

type HostingConfig = {subdomain : string};
type HostedAsset = {url : string};

export const grtOrCreateHostingConfig = async () :Promise<HostingConfig | null > =>{
  const exiting = (await puter.kv.get())
}