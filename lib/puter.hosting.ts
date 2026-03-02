import puter from "@heyputer/puter.js";
import { createHoostingSlug, HOSTING_CONFIG_KEY } from "./utils";

type HostingConfig = {subdomain : string};
type HostedAsset = {url : string};

export const grtOrCreateHostingConfig = async () :Promise<HostingConfig | null > =>{
  const exiting = (await puter.kv.get(HOSTING_CONFIG_KEY)) as HostingConfig |null ;
  if(exiting ?.subdomain) return {subdomain : exiting.subdomain};

  const subdomain = createHoostingSlug();

  try {
    const created = await puter.hosting.create(subdomain, '.');

return {subdomain: created.subdomain};
    
  } catch (e) {
    console.log(`Could not find subdomain: ${e}`);
    return null;
  }
}