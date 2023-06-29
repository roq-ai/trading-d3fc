const mapping: Record<string, string> = {
  businesses: 'business',
  trades: 'trade',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
