export function formatRecipeCountShowing(count: number): string {
  if (count === 0) return 'No recipes';
  if (count === 1) return '1 recipe';
  return `${count} recipes`;
}

export function formatCategoryRecipeCount(count: number): string {
  if (count === 0) return 'No recipes';
  if (count === 1) return '1 recipe';
  return `${count} recipes`;
}
