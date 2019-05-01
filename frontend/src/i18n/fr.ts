type Translations = { [key: string]: string | Translations }

const translations: Translations = {
  loading: 'Chargement',
  components: {
    layout: {
      subtitle: 'Vos prochaines séances de cinéma en version originale',
    },
    movie: {
      full: {
        actorList: 'Avec {actors}',
        directorList: 'De {directors}',
        duration: `Durée : {minutes} {minutes, plural,
          one {minute}
          other {minutes}
        }`,
        synopsis: 'Synopsis',
        previous: 'Précédent',
        next: 'Suivant',
      },
      poster: { title: 'Poster du film {movieName}' },
    },
    subscriber: {
      subscribe: {
        emailPlaceholder: 'Votre email',
        submit: "S'inscrire",
      },
      unsubscribe: {
        unsubscription: {
          message: 'Désinscription en cours...',
          cancel: 'Annuler',
        },
        unsubscribed: {
          message:
            'Vous ne voulez plus être inscrit à nos newsletter ? On est un peu triste, mais on comprend !',
          cancel:
            "Si c'est une erreur, vous pouvez toujours {link} pour être réinscrit !",
          cancelLink: 'cliquer ici',
        },
        resubscribed:
          "Aahhhh, on savait qu'on allait vous manquer ! Re-bienvenue à bord !",
        notfound:
          'Vous ne semblez pas être présent dans notre base de donnée, ne vous seriez vous pas déjà désinscrit ?',
      },
    },
  },
  modules: {
    home: {
      nomovies: 'Pas de film cette semaine !',
    },
  },
}

const objectToPath = (
  translations: Translations,
  previousTranslations: Translations = {},
  currentPath?: string
): Translations =>
  Object.keys(translations).reduce((acc, key) => {
    const path = currentPath ? [currentPath, key].join('.') : key
    const value = translations[key]
    if (typeof value == 'string') return { ...acc, [path]: value }
    return objectToPath(value, acc, path)
  }, previousTranslations)

export default objectToPath(translations) as { [key: string]: string }
