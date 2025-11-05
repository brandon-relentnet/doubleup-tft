export type TagSearch = {
  tag: string | undefined
}

export const TAGLESS_SEARCH: TagSearch = Object.freeze({ tag: undefined })

export function noTagSearch(): TagSearch {
  return { tag: undefined }
}
