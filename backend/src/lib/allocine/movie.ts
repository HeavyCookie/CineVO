interface Person {
  internalId: number
  lastName: string
  firstName: string
}

interface Country {
  id: number
  localizedName: string
  name: string
}

interface Credit {
  person: Person
  position: {
    name: 'DIRECTOR'
    department: 'DIRECTION'
  }
  rank: number
}

interface Genre {
  id: number
  translate: string
  tag: string
}

interface Release {
  name: string
  releaseDate: {
    /* Date as YYYY-MM-DD */
    date: string
  }
}

export interface Movie {
  cast: {
    actor?: Person
    voiceActor?: Person
    originalVoiceActor?: Person
    rank?: number
  }[]
  countries: Country[]
  credits: Credit[]
  flags: {
    hasOnlineProduct: boolean
    hasPhysicalProduct: boolean
    hasPreview: boolean
    hasShowtime: boolean
    hasSoundtrack: boolean
    hasTheaterRelease: boolean
    hasDvdRelease: boolean
    hasOnlineRelease: boolean
    hasTrivia: boolean
    isAmazon: boolean
    isClub300Approved: boolean
    isComingSoon: boolean
    isPlayingNow: boolean
    onlyNetflix: boolean
    tvRelease: boolean
    comingSoonOnNetflix: boolean
  }
  genres: Genre[]
  internalId: number
  languages: string[]
  originalTitle: string
  poster?: { id: number; url: string; path: string }
  releases?: { name: 'Released'; releaseDate: { date: string } }[]
  /* weird format as "xh xxmin" */
  runtime: string
  stats: {
    userRating?: { score: number; count: number }
    userReview?: { count: number }
    pressReview?: { score: number; count: number }
  }
  synopsis: string
  synopsisFull: string
  title: string
  customFlags: {
    isPremiere: boolean
    weeklyOuting: boolean
  }
}
