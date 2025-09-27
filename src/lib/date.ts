export const parseISO = (v?: string | null) => (v ? new Date(v) : undefined);
