import puter from "@heyputer/puter.js";
import { HOSTING_CONFIG_KEY } from "./utils";

type HostingConfig = {subdomain : string};
type HostedAsset = {url : string};

export const grtOrCreateHostingConfig = async () :Promise<HostingConfig | null > =>{
  const exiting = (await puter.kv.get(HOSTING_CONFIG_KEY)) as HostingConfig |null ;
  if(exiting ?.subdomain) return {subdomain : exiting.subdomain};

  const subdomain = createHostingSlug();

}