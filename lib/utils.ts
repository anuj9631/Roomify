export const HOSTING_CONFIG_KEY =  "roomify_hosting_config";

export const HOSTING_DOMAIN_SUFFIX =  ".puter.site";

export const createHoostingSlug = ()=>`rommify-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;